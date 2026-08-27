// Covers scripts/check-safety-mechanisms.mjs in both directions: a mechanism
// that is DELETED must fail, and a mechanism that is merely TRANSLATED must
// not. The second half is the one that needed pinning.
//
// The gate's whole premise is that each mechanism matches its Finnish OR
// English form, so the count survives translation. Three matcher bugs broke
// that premise silently:
//
//   - ASCII \b does not fire next to ä/ö, so `\bälä käytä\b` and `\bVIHREÄ\b`
//     matched nothing at all - a deletion of either was invisible.
//   - `human (review|approv)\b` rejected its own inflections, so translating
//     `ihminen tarkistaa` into "human reviews" dropped the count 1 -> 0 and
//     failed a CORRECT translation.
//   - A literal space did not survive a line wrap.
//
// None of these were visible from the gate's output: it reported green. They
// are pinned here so they cannot return.

import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Finnish source text carrying one of every mechanism.
const FI = [
  '# Ohje',
  '',
  '**Vastuuvapaus:** luonnos tarkistettavaksi — ei oikeudellinen neuvo.',
  '',
  'Riskiluokka: VIHREÄ',
  '',
  'Varmuustaso: Älä käytä',
  '',
  'Luonnos, jonka ihminen tarkistaa ennen lähettämistä.',
  '',
  'Tarkista luku `[varmista — ympäristöjuristin arvioitava]` erikseen.',
  '',
].join('\n');

const SNAPSHOT = {
  description: 'Fixture snapshot.',
  takenAt: '2026-01-01',
  files: {
    'domain/fi.md': {
      disclaimer: 1,
      'risk-colour': 1,
      'certainty-tier': 1,
      'human-review-gate': 2,
      'certainty-flag': 1,
    },
  },
};

function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'safety-gate-'));
  mkdirSync(join(root, 'scripts'), { recursive: true });
  mkdirSync(join(root, 'references'), { recursive: true });
  mkdirSync(join(root, 'domain'), { recursive: true });

  for (const script of ['check-safety-mechanisms.mjs', 'lib.mjs']) {
    cpSync(join(ROOT, 'scripts', script), join(root, 'scripts', script));
  }
  writeFileSync(join(root, 'references/safety-snapshot.json'), JSON.stringify(SNAPSHOT, null, 2));
  writeFileSync(join(root, 'domain/fi.md'), FI);
  return root;
}

function runGate(root) {
  const r = spawnSync(process.execPath, ['scripts/check-safety-mechanisms.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  return { status: r.status, output: r.stdout + r.stderr };
}

/** Replaces domain/fi.md with `body`, then runs the gate. */
function withBody(body) {
  const root = makeFixture();
  try {
    writeFileSync(join(root, 'domain/fi.md'), body);
    return runGate(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- the snapshot itself must be reachable ---------------------------------

test('unchanged Finnish source passes', () => {
  const { status, output } = withBody(FI);

  assert.equal(status, 0, output);
  assert.match(output, /still in place/);
});

// --- deletions must fail ---------------------------------------------------

test('deleting the disclaimer is an error', () => {
  const { status, output } = withBody(FI.replace(/\*\*Vastuuvapaus:.*\n/, ''));

  assert.equal(status, 1, output);
  assert.match(output, /disclaimer line: 1 before, 0 now/);
});

test('deleting the Finnish "Älä käytä" tier is an error', () => {
  const { status, output } = withBody(FI.replace('Varmuustaso: Älä käytä', 'Varmuustaso:'));

  assert.equal(status, 1, output);
  assert.match(output, /three-tier certainty marker: 1 before, 0 now/);
});

test('deleting the VIHREÄ risk marker is an error', () => {
  const { status, output } = withBody(FI.replace('Riskiluokka: VIHREÄ', 'Riskiluokka:'));

  assert.equal(status, 1, output);
  assert.match(output, /risk colour marker: 1 before, 0 now/);
});

test('deleting a human-review gate is an error', () => {
  const { status, output } = withBody(FI.replace('jonka ihminen tarkistaa ', ''));

  assert.equal(status, 1, output);
  assert.match(output, /human-review gate: 2 before, 1 now/);
});

test('deleting the inline certainty flag is an error', () => {
  const { status, output } = withBody(FI.replace(/`\[varmista[^`]*`/, 'erikseen'));

  assert.equal(status, 1, output);
  assert.match(output, /inline certainty flag: 1 before, 0 now/);
});

// --- correct translation must NOT fail -------------------------------------
//
// This is the half that was missing. A gate that fails a correct translation
// gets switched off, and then the deletions above stop being caught too.

test('translating every mechanism to English keeps the gate green', () => {
  const en = [
    '# Guide',
    '',
    '**Disclaimer:** a draft for review — not legal advice.',
    '',
    'Risk level: GREEN',
    '',
    'Certainty: Do not use',
    '',
    'A draft that a human reviews before it is sent.',
    '',
    'Check the chapter `[confirm — requires a lawyer\'s assessment]` separately.',
    '',
  ].join('\n');

  const { status, output } = withBody(en);

  assert.equal(status, 0, output);
});

test('"human reviews" and "human approval" count as review gates', () => {
  for (const phrase of ['a human reviews it', 'human approval is required', 'the human reviewer signs']) {
    const body = FI.replace('jonka ihminen tarkistaa ennen lähettämistä', phrase);
    const { status, output } = withBody(body);

    assert.equal(status, 0, `${phrase}\n${output}`);
  }
});

test('a mechanism split across a line wrap still counts', () => {
  const wrapped = FI
    .replace('Varmuustaso: Älä käytä', 'Varmuustaso: *Do not\n   use*')
    .replace('jonka ihminen tarkistaa ennen lähettämistä', "requires a lawyer's\n  assessment");

  const { status, output } = withBody(wrapped);

  assert.equal(status, 0, output);
});

test('a Finnish compound keeps its review gate', () => {
  // ympäristöjuristin / verojuristin — the term attaches directly to its head.
  const body = FI.replace('ympäristöjuristin arvioitava', 'verojuristin arvioitava');
  const { status, output } = withBody(body);

  assert.equal(status, 0, output);
});

// --- and the wrap tolerance must not be too greedy --------------------------

test('a mechanism is not matched across a blank line', () => {
  // "Do not" and "use" separated by a paragraph break are two unrelated words.
  // If this ever passes, the whitespace fragment has become too permissive.
  const split = FI.replace('Varmuustaso: Älä käytä', 'Varmuustaso: Do not\n\nuse');
  const { status, output } = withBody(split);

  assert.equal(status, 1, output);
  assert.match(output, /three-tier certainty marker/);
});

// --- every documented form must be visible ---------------------------------
//
// The bugs above were all the same shape: a form that reads perfectly well but
// that the matcher could not see. `VIHREÄ` was invisible while `KELTAINEN` and
// `PUNAINEN` worked, and two of three risk colours matching is exactly the
// condition under which nobody investigates - the gate looks alive.
//
// So each documented form gets its own fixture and its own test. The snapshot
// says the mechanism occurs once; if the matcher is blind to that form the gate
// reports it lost and the test fails, naming the form. This is the guard for
// the next person who "simplifies" a regex below.

const FORMS = {
  disclaimer: ['**Vastuuvapaus:** luonnos', 'Vastuuvapaus: luonnos', '**Disclaimer:** a draft'],
  'risk-colour': ['VIHREÄ', 'KELTAINEN', 'PUNAINEN', 'GREEN', 'YELLOW', 'RED'],
  'certainty-tier': [
    'Varmistettu', 'Tarkistettava', 'Älä käytä', 'älä käytä', 'ala kayta',
    'Verified', 'Needs checking', 'Do not use',
  ],
  'human-review-gate': [
    'ihminen tarkistaa', 'ihminen vastaa', 'ihminen hyväksyy',
    'juristin arvioitava', 'juristin tarkistettava', 'ympäristöjuristin arvioitava',
    'human review', 'human reviews', 'human reviewer', 'human approval',
    'human approves', "a lawyer's assessment", 'a lawyers assessment',
  ],
  'certainty-flag': [
    '[tarkista]', '[varmista — juristin arvioitava]', '[muistinvarainen — tarkista Finlexistä]',
    '[mallin laskelma — tarkista]', '[check]', '[confirm — requires review]',
    '[from memory — verify in Finlex]', '[model calculation — check]',
  ],
};

/** One-file fixture whose snapshot expects exactly one instance of `id`. */
function runFormFixture(id, form) {
  const root = mkdtempSync(join(tmpdir(), 'safety-form-'));
  try {
    mkdirSync(join(root, 'scripts'), { recursive: true });
    mkdirSync(join(root, 'references'), { recursive: true });
    mkdirSync(join(root, 'domain'), { recursive: true });
    for (const script of ['check-safety-mechanisms.mjs', 'lib.mjs']) {
      cpSync(join(ROOT, 'scripts', script), join(root, 'scripts', script));
    }
    writeFileSync(
      join(root, 'references/safety-snapshot.json'),
      JSON.stringify({ takenAt: '2026-01-01', files: { 'domain/one.md': { [id]: 1 } } }, null, 2),
    );
    writeFileSync(join(root, 'domain/one.md'), `# One\n\n${form}\n`);
    return runGate(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

for (const [id, forms] of Object.entries(FORMS)) {
  for (const form of forms) {
    test(`${id} sees ${JSON.stringify(form)}`, () => {
      const { status, output } = runFormFixture(id, form);

      assert.equal(status, 0, `matcher is blind to this form:\n${output}`);
    });
  }
}

