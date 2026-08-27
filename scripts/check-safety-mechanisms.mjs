#!/usr/bin/env node
// Safety-mechanism integrity gate.
//
//   node scripts/check-safety-mechanisms.mjs --snapshot   # record current state
//   node scripts/check-safety-mechanisms.mjs              # verify against snapshot
//
// The repository's safety properties are carried by a small number of textual
// mechanisms: the disclaimer on every skill, the inline certainty flags, the
// risk colour coding, and the human-review gates. AGENTS.md states the rule
// plainly: "Every disclaimer stays. Translate, never delete."
//
// Nothing enforced that. Verified by experiment: deleting the `Vastuuvapaus:`
// block from employment-law/skills/employment-contract/SKILL.md passes the
// validator, the citation gate, the output-language gate and the description
// lint, all green. A translator working through 117k words can drop one and
// no gate notices.
//
// This is a per-file COUNT comparison, deliberately language-aware: each
// mechanism is matched by its Finnish OR English form, so the count survives
// translation while a deletion does not. Translating `Vastuuvapaus:` to
// `Disclaimer:` keeps the count at 1; removing the line drops it to 0.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { ROOT, readJSON } from './lib.mjs';

const SNAPSHOT = 'references/safety-snapshot.json';
const SKIP = new Set(['node_modules', 'docs', 'dist', '.git']);

// Each mechanism matches its Finnish and English forms with one regex, so the
// count is invariant under translation. Adding a language variant here is how
// you teach the gate a new phrasing — do not add a second mechanism for it.
//
// Boundaries and whitespace are built from the fragments below rather than
// written inline, because doing it by hand produced three silent blind spots:
//
//   \b is ASCII-only, so it does not fire next to ä/ö/Ä. `\bVIHREÄ\b` and
//   `\bälä käytä\b` therefore never matched anything - the GREEN risk marker
//   and the Finnish "do not use" tier were invisible in 33 files, including
//   every domain's AGENTS.md. A translator could delete either and this gate
//   would report green.
//
//   A literal space does not survive a line wrap. `*Do not\n   use*` and
//   `a lawyer's\n  assessment` read normally and matched nothing.
//
//   A trailing \b after a word STEM rejects its own inflections: `human
//   (review|approv)\b` matched "human review" but not "human reviews",
//   "human reviewer", "human approval" or "human approves" - so translating
//   `ihminen tarkistaa` into the most natural English dropped the count from
//   1 to 0 and failed a CORRECT translation. That is the worst failure mode
//   here: the gate blocking the merge it exists to protect.
//
// EDGE is Unicode-aware. WS accepts a single line wrap with indentation but
// not a blank line, so a mechanism cannot be matched across a paragraph break.
// STEM allows a word stem to carry its inflections.
//
// HEAD exists because Finnish compounds attach directly: a human-review gate is
// written `ympäristöjuristin arvioitava`, not `ympäristö juristin arvioitava`.
// The old ASCII \b matched `juristin` inside that compound only by accident -
// the boundary fired on the non-ASCII `ö` - so tightening the boundary without
// HEAD would have silently DROPPED a real gate in environment-and-planning and
// failed the branch. Finnish terms that legitimately appear as a compound tail
// therefore opt in to a compound head rather than relying on a broken \b.
const NOT_LETTER = '[\\p{L}\\p{N}]';
const OPEN = `(?<!${NOT_LETTER})`;
const CLOSE = `(?!${NOT_LETTER})`;
const WS = '(?:[ \\t]+|[ \\t]*\\r?\\n[ \\t]*)';
const STEM = '\\p{L}*';
const HEAD = '\\p{L}*';

/** Builds a Unicode-aware, line-wrap-tolerant matcher from a phrase alternation. */
function mechanism(body, extraFlags = '') {
  return new RegExp(`${OPEN}(?:${body})${CLOSE}`, `gu${extraFlags}`);
}

const MECHANISMS = [
  {
    id: 'disclaimer',
    // Vastuuvapaus: / Disclaimer:
    re: new RegExp(`${OPEN}(?:vastuuvapaus|disclaimer)\\s*[::]`, 'giu'),
    what: 'disclaimer line',
  },
  {
    id: 'certainty-flag',
    // [tarkista] [varmista — ...] [muistinvarainen — ...] [mallin laskelma — ...]
    // [check] [confirm — ...] [from memory — ...] [model calculation — ...]
    re: new RegExp(
      `\\[(?:tarkista|varmista|muistinvarainen|mallin${WS}laskelma|check|confirm|` +
        `from${WS}memory|model${WS}calculation)${CLOSE}[^\\]]*\\]`,
      'giu',
    ),
    what: 'inline certainty flag',
  },
  {
    id: 'risk-colour',
    re: mechanism('VIHREÄ|KELTAINEN|PUNAINEN|GREEN|YELLOW|RED'),
    what: 'risk colour marker',
  },
  {
    id: 'certainty-tier',
    // Varmistettu / Tarkistettava / Älä käytä -> Verified / Needs checking / Do not use
    re: mechanism(
      `varmistettu|tarkistettava|älä${WS}käytä|ala${WS}kayta|verified|` +
        `needs${WS}checking|do${WS}not${WS}use`,
      'i',
    ),
    what: 'three-tier certainty marker',
  },
  {
    id: 'human-review-gate',
    // "ihminen tarkistaa", "human reviews", "requires a lawyer's assessment"
    re: mechanism(
      `ihminen${WS}(?:tarkistaa|vastaa|hyväksyy)|human${WS}(?:review|approv)${STEM}|` +
        `${HEAD}juristin${WS}(?:arvioitava|tarkistettava)|lawyer'?s${WS}assessment`,
      'i',
    ),
    what: 'human-review gate',
  },
];

function* mdFiles(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* mdFiles(path);
    // SKILLS.md is generated from frontmatter — the sources already carry these.
    else if (name.endsWith('.md') && name !== 'SKILLS.md') yield path;
  }
}

function countIn(text) {
  const counts = {};
  for (const m of MECHANISMS) {
    m.re.lastIndex = 0;
    const n = (text.match(m.re) || []).length;
    if (n > 0) counts[m.id] = n;
  }
  return counts;
}

function collect() {
  const files = {};
  for (const full of mdFiles(ROOT)) {
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    const counts = countIn(readFileSync(full, 'utf8'));
    if (Object.keys(counts).length > 0) files[rel] = counts;
  }
  return files;
}

// ---------------------------------------------------------------------------
// Snapshot mode
// ---------------------------------------------------------------------------

if (process.argv.includes('--snapshot')) {
  const files = collect();
  const total = Object.values(files).reduce(
    (n, counts) => n + Object.values(counts).reduce((a, b) => a + b, 0),
    0,
  );

  writeFileSync(
    join(ROOT, SNAPSHOT),
    `${JSON.stringify(
      {
        description:
          'Per-file counts of the safety mechanisms that carry this repository\'s ' +
          'safety properties: disclaimers, inline certainty flags, risk colour coding, ' +
          'three-tier certainty markers and human-review gates. Matched by Finnish OR ' +
          'English form, so the count survives translation while a deletion does not. ' +
          'AGENTS.md: "Every disclaimer stays. Translate, never delete." Regenerate ' +
          'only when a mechanism is INTENTIONALLY removed, and say why in the commit.',
        takenAt: new Date().toISOString().slice(0, 10),
        files,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`\n✓ Safety snapshot written: ${Object.keys(files).length} files, ${total} mechanisms.\n`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Check mode
// ---------------------------------------------------------------------------

const snapshotPath = join(ROOT, SNAPSHOT);
if (!existsSync(snapshotPath)) {
  console.error(`\n✗ ${SNAPSHOT} is missing. Run: node scripts/check-safety-mechanisms.mjs --snapshot\n`);
  process.exit(1);
}

const snapshot = readJSON(snapshotPath);
const live = collect();

// Follow renames so a path migration does not read as a lost mechanism.
const renamed = new Map();
const mapPath = join(ROOT, 'scripts/rename-map.json');
if (existsSync(mapPath)) {
  const rules = [...readJSON(mapPath).paths].sort((a, b) => b.from.length - a.from.length);
  for (const oldPath of Object.keys(snapshot.files)) {
    for (const rule of rules) {
      if (oldPath === rule.from) { renamed.set(oldPath, rule.to); break; }
      if (oldPath.startsWith(`${rule.from}/`)) {
        renamed.set(oldPath, `${rule.to}${oldPath.slice(rule.from.length)}`);
        break;
      }
    }
  }
}

const byId = Object.fromEntries(MECHANISMS.map((m) => [m.id, m.what]));
const problems = [];

for (const [oldPath, expected] of Object.entries(snapshot.files)) {
  const nowPath = renamed.get(oldPath) ?? oldPath;
  const actual = live[nowPath] || {};

  for (const [id, count] of Object.entries(expected)) {
    const now = actual[id] || 0;
    if (now < count) {
      problems.push({
        file: nowPath,
        msg: `${byId[id] || id}: ${count} before, ${now} now`,
      });
    }
  }
}

console.log('\nsafety-mechanism gate');
console.log(`  snapshot taken ${snapshot.takenAt} · ${Object.keys(snapshot.files).length} files\n`);

for (const p of problems) console.log(`  ✗  ${p.file}: ${p.msg}`);

if (problems.length === 0) {
  console.log('\n✓ Every disclaimer, certainty flag and review gate is still in place.\n');
  process.exit(0);
}

console.log(`\n✗ ${problems.length} safety mechanism(s) lost.`);
console.log('  These are matched in Finnish OR English, so translating one keeps the count.');
console.log('  A drop means the mechanism was deleted, not translated.');
console.log('  See references/glossary.md section 4.\n');
process.exit(1);
