// Pins the safety matcher itself.
//
// This layer was missing, and its absence is not academic. The snapshot is the
// only thing that currently guards the matcher, and it guards it only until
// someone re-snapshots — which is the documented workflow whenever counts
// legitimately change. Measured on the real tree:
//
//   revert the Unicode fix                  -> check-safety-mechanisms exit 1
//   revert the Unicode fix AND re-snapshot  -> every gate exit 0, all tests
//                                              green, count silently 741 -> 739
//
// So a careless walk down a documented path reverts the matcher with a fully
// green tree. Every defect found in this migration was invisible by
// construction; these tests are what stops one being reintroduced the same way.
//
// The fixture is synthetic and the assertions are on BEHAVIOUR, not on counts
// in the live tree, so they do not move when content is edited.

import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs the real gate in --snapshot mode over one markdown fixture and returns
 * the per-mechanism counts it recorded. Running the actual script rather than
 * re-implementing its regexes is deliberate: a test that rebuilds the pattern
 * proves only that the test and the copy agree.
 */
function countsFor(body) {
  const root = mkdtempSync(join(tmpdir(), 'safety-matcher-'));
  try {
    mkdirSync(join(root, 'scripts'), { recursive: true });
    mkdirSync(join(root, 'references'), { recursive: true });
    for (const s of ['check-safety-mechanisms.mjs', 'lib.mjs']) {
      cpSync(join(ROOT, 'scripts', s), join(root, 'scripts', s));
    }
    writeFileSync(join(root, 'probe.md'), body);

    const r = spawnSync(process.execPath, ['scripts/check-safety-mechanisms.mjs', '--snapshot'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(r.status, 0, r.stdout + r.stderr);

    const snap = JSON.parse(readFileSync(join(root, 'references/safety-snapshot.json'), 'utf8'));
    return snap.files['probe.md'] || {};
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const count = (body, id) => countsFor(body)[id] || 0;

// ---------------------------------------------------------------------------
// Unicode boundaries — \b is defined against [A-Za-z0-9_] and never fires next
// to ä or ö. With \b these were invisible while KELTAINEN matched, which is why
// it went unnoticed: deleting every GREEN marker in the repository passed.
// ---------------------------------------------------------------------------

test('Finnish risk colours are counted', () => {
  assert.equal(count('Riskiluokka: VIHREÄ ja KELTAINEN ja PUNAINEN.', 'risk-colour'), 3);
});

test('English risk colours are counted', () => {
  assert.equal(count('Risk: GREEN, YELLOW, RED.', 'risk-colour'), 3);
});

test('a Finnish certainty tier beginning with a non-ASCII letter is counted', () => {
  assert.equal(count('Älä käytä muistia.', 'certainty-tier'), 1);
});

test('a risk colour inside a longer word is NOT counted', () => {
  // The boundary must still be a boundary; loosening it must not make the
  // matcher fire on arbitrary substrings.
  assert.equal(count('REDACTED and GREENHOUSE and VIHREÄT.', 'risk-colour'), 0);
});

// ---------------------------------------------------------------------------
// Inflections — a trailing boundary after a stem rejects the word's own forms,
// so the most natural English translation dropped the count and failed the gate
// that exists to protect it. Correct work must not break a safety gate.
// ---------------------------------------------------------------------------

test('English review-gate inflections are all counted', () => {
  const body = [
    'A human review is required.',
    'A human reviews the draft.',
    'A human reviewer signs off.',
    'Human approval is needed.',
    'A human approves it.',
  ].join('\n');
  assert.equal(count(body, 'human-review-gate'), 5);
});

test('Finnish review-gate inflections are all counted', () => {
  const body = 'Ihminen tarkistaa sen. Ihminen vastaa siitä. Ihminen hyväksyy sen.';
  assert.equal(count(body, 'human-review-gate'), 3);
});

test('the certainty tier survives subject-verb agreement', () => {
  // "the values needs checking" is wrong English. A translator must not have to
  // choose between correct grammar and a passing gate — the same defect as the
  // human-review stem, on a different mechanism. Eleven real markers in the tree
  // were invisible in the plural form before this.
  const body = [
    'Every value needs checking.',
    'The values need checking.',
    'These are drafts that need checking.',
  ].join('\n');
  assert.equal(count(body, 'certainty-tier'), 3);
});

// ---------------------------------------------------------------------------
// Line wraps — a marker broken across a line is still the marker, but a marker
// spanning a BLANK line is two paragraphs the matcher glued together.
// ---------------------------------------------------------------------------

test('a marker wrapped across one line is counted', () => {
  assert.equal(count("mark it `[confirm — requires a lawyer's\nassessment]`.", 'human-review-gate'), 1);
});

test('a marker spanning a blank line is NOT counted', () => {
  // Regression test for a false positive introduced by the wrap fix itself.
  assert.equal(count("...a lawyer's\n\nassessment of the facts...", 'human-review-gate'), 0);
});

test('a wrapped certainty tier is counted', () => {
  assert.equal(count('the status stays at "Needs\nchecking" for now.', 'certainty-tier'), 1);
});

// ---------------------------------------------------------------------------
// Finnish compounds — Finnish builds words by prefixing, so the marker word is
// not at a word boundary. This is the same class as the ASCII \b defect, on the
// side the gate's translation-invariance premise actually rests on.
// ---------------------------------------------------------------------------

test('a Finnish compound review gate is counted', () => {
  assert.equal(count('Merkitse `[varmista — ympäristöjuristin arvioitava]`.', 'human-review-gate'), 1);
});

test('the uncompounded Finnish review gate is still counted', () => {
  assert.equal(count('Merkitse `[varmista — juristin arvioitava]`.', 'human-review-gate'), 1);
});

// ---------------------------------------------------------------------------
// Translation invariance — the property the whole gate exists to assert.
// ---------------------------------------------------------------------------

test('translating a file does not change its mechanism count', () => {
  const fi = [
    'Vastuuvapaus: tämä ei ole oikeudellista neuvontaa.',
    'Riskiluokka: VIHREÄ.',
    'Älä käytä muistia.',
    'Ihminen tarkistaa lopputuloksen.',
    '[tarkista]',
  ].join('\n\n');

  const en = [
    'Disclaimer: this is not legal advice.',
    'Risk class: GREEN.',
    'Do not use memory.',
    'A human reviews the result.',
    '[check]',
  ].join('\n\n');

  assert.deepEqual(countsFor(fi), countsFor(en));
});
