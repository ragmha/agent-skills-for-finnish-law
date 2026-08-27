// Covers scripts/check-citations.mjs in both directions: a citation that is
// LOST during translation, and one that is INVENTED. The added-citation half is
// graded, so the tests pin the grading too - a gate that reported every moved
// citation as an error would be turned off within a week.
//
// The fixture is synthetic rather than a copy of the repository. The live tree
// is being translated continuously, so asserting against it would make these
// tests fail for reasons that have nothing to do with the gate.
//
// If you are checking that these tests actually catch a regression, revert the
// GATE against the commit that predates the fix - not with `git stash`, which
// reverts to HEAD and, once the fix is committed, measures the fix against
// itself and reports a confident green. Three separate people hit that exact
// mechanism while verifying this work: each accepted a passing result without
// confirming what it had been run against. Name the ref explicitly:
//
//   git show <pre-fix-ref>:scripts/check-citations.mjs > scripts/check-citations.mjs
//   node --test tests/citation-gate.test.mjs   # must FAIL, and name the forms
//   git checkout -- scripts/check-citations.mjs
//
// A negative test that has never been observed failing is not evidence.

import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SNAPSHOT = {
  description: 'Fixture snapshot.',
  takenAt: '2026-01-01',
  files: {
    'domain/a.md': { '55/2001': 2, 'KKO:2019:42': 1 },
    'domain/b.md': { '410/2015': 1 },
    // Pre-1900 statutes need their own regex; see domain/c.md below.
    'domain/c.md': { '39/1889': 2, '4/1734': 1 },
  },
};

// One verified statute that the snapshot does NOT contain, so the
// tracking/statutes.json cross-check can be exercised on its own. The registry
// uses English keys; the gate also accepts the historical Finnish ones.
const STATUTES = { statutes: [{ number: '38/1978', name: 'Kuluttajansuojalaki' }] };

const FILE_A = [
  '# A',
  '',
  'Employment Contracts Act (tyosopimuslaki 55/2001) applies.',
  'See KKO:2019:42 and tyosopimuslaki 55/2001 again.',
  '',
].join('\n');

const FILE_B = ['# B', '', 'Local Government Act (kuntalaki 410/2015).', ''].join('\n');

// rikoslaki 39/1889 and oikeudenkaymiskaari 4/1734 are both in force and among
// the most cited statutes in the collection, but the 19xx/20xx pattern cannot
// see them - they need the 17xx-18xx one. Copying an older revision of the
// script over a newer one silently reverted that pattern once, and every
// reference to these two immediately reported as lost. These fixtures exist so
// that regression fails here instead of on a merge-blocking branch.
const FILE_C = [
  '# C',
  '',
  'Criminal Code (rikoslaki 39/1889) chapter 6 governs sentencing.',
  'Code of Judicial Procedure (oikeudenkaymiskaari 4/1734) applies to the hearing.',
  'See rikoslaki 39/1889 chapter 7 as well.',
  '',
].join('\n');

/** Builds a throwaway repository containing just what the gate reads. */
function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'citation-gate-'));
  mkdirSync(join(root, 'scripts'), { recursive: true });
  mkdirSync(join(root, 'references'), { recursive: true });
  mkdirSync(join(root, 'tracking'), { recursive: true });
  mkdirSync(join(root, 'domain'), { recursive: true });

  for (const script of ['check-citations.mjs', 'lib.mjs']) {
    cpSync(join(ROOT, 'scripts', script), join(root, 'scripts', script));
  }

  writeFileSync(join(root, 'references/citation-snapshot.json'), JSON.stringify(SNAPSHOT, null, 2));
  writeFileSync(join(root, 'tracking/statutes.json'), JSON.stringify(STATUTES, null, 2));
  writeFileSync(join(root, 'domain/a.md'), FILE_A);
  writeFileSync(join(root, 'domain/b.md'), FILE_B);
  writeFileSync(join(root, 'domain/c.md'), FILE_C);
  return root;
}

function runGate(root) {
  const result = spawnSync(process.execPath, ['scripts/check-citations.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  return { status: result.status, output: result.stdout + result.stderr };
}

/** Runs `mutate` against a fresh fixture and returns the gate's verdict. */
function withFixture(mutate) {
  const root = makeFixture();
  try {
    mutate(root);
    return runGate(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writeA(root, body) {
  writeFileSync(join(root, 'domain/a.md'), body);
}

function writeC(root, body) {
  writeFileSync(join(root, 'domain/c.md'), body);
}

test('unchanged tree passes', () => {
  const { status, output } = withFixture(() => {});

  assert.equal(status, 0, output);
  assert.match(output, /no citation was invented/);
});

// --- pre-1900 statutes -----------------------------------------------------
//
// The guard below is the one that matters. Dropping the 17xx-18xx pattern makes
// the matcher blind to tokens the snapshot still expects, so they all report as
// lost - which is a FAILURE the "citation dropped" tests would happily accept.
// Only an unchanged-tree assertion catches it, so it is stated explicitly.

test('pre-1900 statutes are matched, not reported as lost', () => {
  const { status, output } = withFixture(() => {});

  assert.equal(status, 0, output);
  assert.doesNotMatch(output, /39\/1889/);
  assert.doesNotMatch(output, /4\/1734/);
});

test('rikoslaki 39/1889 dropped from a file is an error', () => {
  const { status, output } = withFixture((root) => {
    writeC(root, FILE_C.replace('rikoslaki 39/1889 chapter 7', 'the Criminal Code chapter 7'));
  });

  assert.equal(status, 1, output);
  assert.match(output, /domain\/c\.md: citation "39\/1889" appeared 2/);
});

test('oikeudenkaymiskaari 4/1734 dropped from a file is an error', () => {
  const { status, output } = withFixture((root) => {
    writeC(root, FILE_C.replace('(oikeudenkaymiskaari 4/1734)', '(the Code of Judicial Procedure)'));
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "4\/1734" appeared 1/);
});

test('an invented pre-1900 statute number is an error', () => {
  const { status, output } = withFixture((root) => {
    writeC(root, `${FILE_C}\nUnder laki 77/1755 the rule differs.\n`);
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "77\/1755" appears nowhere in the snapshot/);
});

test('fractions and version strings are not mistaken for statutes', () => {
  const { status, output } = withFixture((root) => {
    // Bounded to 17xx-18xx precisely so these stay invisible. If the year range
    // is ever widened, this starts failing - which is the point.
    writeC(root, `${FILE_C}\nRatios 1/2 and 3/4, release 2/1200, build 9/1699.\n`);
  });

  assert.equal(status, 0, output);
  assert.doesNotMatch(output, /1\/2|3\/4|2\/1200|9\/1699/);
});

test('citation dropped from a file is an error', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, FILE_A.replace('tyosopimuslaki 55/2001 again', 'the same Act again'));
  });

  assert.equal(status, 1, output);
  assert.match(output, /domain\/a\.md: citation "55\/2001" appeared 2/);
});

test('case identifier dropped from a file is an error', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, FILE_A.replace('KKO:2019:42', 'the precedent'));
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "KKO:2019:42" appeared 1/);
});

test('statute number found nowhere in the snapshot is an error', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A}\nSee also laki 999/2099.\n`);
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "999\/2099" appears nowhere in the snapshot/);
  assert.match(output, /invented\?/);
});

test('case identifier found nowhere in the snapshot is an error', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A}\nSee KKO:2099:99.\n`);
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "KKO:2099:99" appears nowhere in the snapshot/);
});

test('invented citation in a file the snapshot never recorded is an error', () => {
  const { status, output } = withFixture((root) => {
    writeFileSync(join(root, 'domain/c.md'), '# C\n\nUnder laki 999/2099 the rule is different.\n');
  });

  assert.equal(status, 1, output);
  assert.match(output, /domain\/c\.md: citation "999\/2099" appears nowhere/);
});

test('citation that moved from another file is a warning and does not fail', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A}\nCompare kuntalaki 410/2015.\n`);
  });

  assert.equal(status, 0, output);
  assert.match(output, /citation "410\/2015" is new to this file/);
  assert.match(output, /snapshot had it in domain\/b\.md/);
});

test('citation new to the snapshot but verified in the registry is a warning', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A}\nSee kuluttajansuojalaki 38/1978.\n`);
  });

  assert.equal(status, 0, output);
  assert.match(output, /citation "38\/1978" is new to the snapshot but is a verified statute/);
});

test('repeating a citation the file already had is not reported at all', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A}\nAnd once more, tyosopimuslaki 55/2001.\n`);
  });

  assert.equal(status, 0, output);
  assert.doesNotMatch(output, /55\/2001/);
  assert.doesNotMatch(output, /moved between files/);
});

test('a lost citation and an invented one are reported together', () => {
  const { status, output } = withFixture((root) => {
    writeA(root, `${FILE_A.replace('KKO:2019:42', 'the precedent')}\nUnder laki 999/2099.\n`);
  });

  assert.equal(status, 1, output);
  assert.match(output, /citation "KKO:2019:42" appeared 1/);
  assert.match(output, /citation "999\/2099" appears nowhere/);
  assert.match(output, /2 citation problem\(s\)/);
});
