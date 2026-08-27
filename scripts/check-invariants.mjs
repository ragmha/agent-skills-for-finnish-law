#!/usr/bin/env node
// Repository-invariant gate.
//
// Run: node scripts/check-invariants.mjs
//
// Every finding in this migration has had the same shape: a rule stated in
// AGENTS.md with no mechanical enforcement behind it. Four so far —
//
//   "never invent a statute number"        -> gate only checked the drop direction
//   "copy <domain>/skills/* into a harness" -> refs pointed outside the skill dir
//   "every disclaimer stays"                -> nothing checked it at all
//   fork provenance URL                     -> rewritten to a repo that 404s
//
// An unenforced rule in legal material is worse than no rule, because a
// reviewer reads it and assumes it holds. This file is where a stated
// invariant gets a check. Adding a rule to AGENTS.md should mean adding a
// case here.

import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { basename, join } from 'node:path';

import { ROOT, readJSON } from './lib.mjs';

const ls = (pattern) =>
  execFileSync('git', ['ls-files', pattern], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

const failures = [];
const fail = (rule, detail) => failures.push({ rule, detail });

const agentsMd = readFileSync(join(ROOT, 'AGENTS.md'), 'utf8');
const renameMap = readJSON(join(ROOT, 'scripts/rename-map.json'));

// ---------------------------------------------------------------------------
// 1. Fork provenance must point at the REAL upstream, not the fork's own name
//
// The rename's identifier substitution matched inside the upstream URL and
// rewrote akunikkola/claude-for-legal-finland into
// akunikkola/agent-skills-for-finnish-law, which does not exist. The drift
// bridge resolves its fetch URL from this row, so a corrupted value silently
// severs the mechanism that carries upstream's legal corrections.
// ---------------------------------------------------------------------------

const upstreamUrl = renameMap.forkedFrom.repository;
const upstreamSlug = upstreamUrl.replace(/^https?:\/\/github\.com\//, '');

if (!agentsMd.includes(upstreamSlug)) {
  fail(
    'fork provenance',
    `AGENTS.md does not reference the real upstream '${upstreamSlug}' from rename-map.json forkedFrom`,
  );
}

// The fork's own slug must never appear under the upstream owner.
const ownerOfUpstream = upstreamSlug.split('/')[0];
const forkName = 'agent-skills-for-finnish-law';
if (agentsMd.includes(`${ownerOfUpstream}/${forkName}`)) {
  fail(
    'fork provenance',
    `AGENTS.md contains '${ownerOfUpstream}/${forkName}' — the rename rewrote the upstream slug; upstream is '${upstreamSlug}'`,
  );
}

// ---------------------------------------------------------------------------
// 2. tracking/statutes.json — English keys, Finnish values
//
// AGENTS.md: "tracking/statutes.json values stay Finnish. check-statutes.mjs
// matches them against Finlex page titles. Translating them breaks the monthly
// watch, and breaks it silently."
//
// Both halves are checkable: the keys must have been migrated, and the values
// must still look Finnish.
// ---------------------------------------------------------------------------

const statutesPath = join(ROOT, 'tracking/statutes.json');
if (!existsSync(statutesPath)) {
  fail('statute registry', 'tracking/statutes.json is missing');
} else {
  const reg = readJSON(statutesPath);

  const declared = renameMap.dataKeys.find((d) => d.file === 'tracking/statutes.json');
  if (declared) {
    for (const [oldKey, newKey] of Object.entries(declared.keys)) {
      if (Object.prototype.hasOwnProperty.call(reg, oldKey)) {
        fail('statute registry', `top-level key '${oldKey}' should be '${newKey}' (rename-map dataKeys)`);
      }
    }
  }

  const entries = reg.statutes;
  if (!Array.isArray(entries) || entries.length === 0) {
    fail('statute registry', "expected a non-empty 'statutes' array");
  } else {
    for (const [i, e] of entries.entries()) {
      if (!e.number || !e.name) {
        fail('statute registry', `entry ${i} is missing 'number' or 'name'`);
        continue;
      }
      // Finnish statutes predate 1900 — rikoslaki is 39/1889 and
      // oikeudenkäymiskaari is 4/1734 — so the year cannot be constrained to
      // the 19xx/20xx range used elsewhere for citation extraction.
      if (!/^\d{1,4}\/\d{4}$/.test(e.number)) {
        fail('statute registry', `entry ${i}: '${e.number}' is not an NNN/YYYY statute number`);
      }
    }

    // Finnish statute names are morphologically distinctive. A name with none
    // of these markers has probably been translated, which breaks the Finlex
    // title match silently — exactly the failure AGENTS.md warns about.
    const FINNISH = /laki|asetus|kaari|s[aä][aä]nt|oikeuden|Suomen|valtion|kirja/i;
    const translated = entries.filter((e) => e.name && !FINNISH.test(e.name));
    if (translated.length > 0) {
      fail(
        'statute registry',
        `${translated.length} statute name(s) look translated and will not match Finlex titles: ` +
          translated.slice(0, 3).map((e) => `${e.number} "${e.name}"`).join(', '),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 3. check-statutes.mjs must read the keys the registry actually uses
//
// The registry and its only consumer are two files that must agree. They drifted
// once already: the dataKeys rename was declared in rename-map.json but never
// applied, so the registry kept Finnish keys while nothing verified the pairing.
// ---------------------------------------------------------------------------

const watchPath = join(ROOT, 'scripts/check-statutes.mjs');
if (existsSync(watchPath)) {
  const watch = readFileSync(watchPath, 'utf8');
  for (const stale of ['.saadokset', '.numero', '.nimi']) {
    if (watch.includes(stale)) {
      fail('statute watch', `check-statutes.mjs still reads '${stale}' but the registry uses English keys`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. rename-map.json must not have been rewritten by its own application
//
// apply-rename.mjs rewrites paths in text files, and this file is a text file
// full of the paths it rewrites. When that happened, every 'from' became its
// own 'to' and the upstream mapping was destroyed.
// ---------------------------------------------------------------------------

const selfMapped = renameMap.paths.filter((p) => p.from === p.to);
if (selfMapped.length > 0) {
  fail(
    'rename map',
    `${selfMapped.length} rule(s) have from === to — the map was rewritten by its own application ` +
      `(e.g. '${selfMapped[0].from}'). Restore it from the commit that introduced it.`,
  );
}

// ---------------------------------------------------------------------------
// 5. Subagent frontmatter name must equal its filename
//
// validate.mjs checks SKILL.md frontmatter only, so an agent file whose `name:`
// disagrees with its filename passes every gate. All six carried their old
// Finnish names after the rename because the FILE was renamed and the field
// inside it was not.
// ---------------------------------------------------------------------------

for (const rel of ls('*/agents/*.md')) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  const declared = text.match(/^name:\s*(.+?)\s*$/m)?.[1];
  if (!declared) continue;

  const expected = basename(rel).replace(/\.md$/, '');
  if (declared !== expected) {
    fail('subagent naming', `${rel}: frontmatter name '${declared}' != filename '${expected}'`);
  }
}

// ---------------------------------------------------------------------------
// 6. No stale Finnish domain slug anywhere in the tree
//
// <domain>/CLAUDE.md is hand-written and generated by nothing, so the rename
// missed all 24 and no gate noticed. A pointer file naming a directory that no
// longer exists sends a reader nowhere.
//
// Severity is split deliberately. A stale slug in a hand-maintained pointer or
// subagent file is an ERROR: nobody else is going to fix it. A stale
// `domain:skill` cross-reference inside a SKILL.md is a WARNING while the
// translation is in flight, because the per-domain translation sessions own
// those files and are remapping the slugs as they go. Failing on them here
// would either block CI for the length of the translation or force a
// tree-wide edit that collides with every running session.
//
// Once translation lands, delete the `inSkillFile` branch and let both fail.
// ---------------------------------------------------------------------------

const oldDomains = renameMap.paths
  .filter((p) => !p.from.includes('/') && !p.to.includes('/'))
  .map((p) => p.from);

let staleInSkills = 0;

for (const rel of ls('*.md')) {
  // The rename map and the fork-provenance section legitimately name old paths.
  if (rel === 'scripts/rename-map.json' || rel === 'AGENTS.md') continue;

  const text = readFileSync(join(ROOT, rel), 'utf8');
  const inSkillFile = /\/skills\/.+\/SKILL\.md$/.test(rel) || /\/references\/.+\.md$/.test(rel);

  for (const old of oldDomains) {
    // Only flag it as a path or an identifier, not as ordinary Finnish prose:
    // `juristi` is also the word for "lawyer".
    const asPath = new RegExp(`\\b${old}/`);
    const asSlug = new RegExp(`\\b${old}:[a-z-]`);
    if (asPath.test(text) || asSlug.test(text)) {
      if (inSkillFile) staleInSkills++;
      else fail('stale domain slug', `${rel} references the pre-rename domain '${old}'`);
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// 7. The practice-profile heading must be spelled identically everywhere
//
// legal-core/skills/practice-profile writes into every domain's AGENTS.md under
// one exact heading. If domains spell it differently the skill writes under a
// heading that does not exist, or fails to find one — silently, and in only
// some domains. Nothing else couples 24 files to one string, and nothing else
// would notice it breaking.
//
// Both spellings are accepted while translation is in flight; the invariant is
// that all 24 agree with each other.
// ---------------------------------------------------------------------------

const HEADING_FI = '## Käytäntöprofiili (valinnainen)';
const HEADING_EN = '## Practice profile (optional)';

const headingSeen = new Map();

for (const entry of readJSON(join(ROOT, 'marketplace.json')).plugins) {
  const rel = `${entry.source.replace(/^\.\//, '')}/AGENTS.md`;
  const full = join(ROOT, rel);
  if (!existsSync(full)) continue;

  const text = readFileSync(full, 'utf8');
  const found = text.includes(HEADING_EN)
    ? HEADING_EN
    : text.includes(HEADING_FI)
      ? HEADING_FI
      : null;

  if (!found) {
    const loose = text.match(/^##+\s*(?:practice profile|käytäntöprofiili).*$/im)?.[0];
    fail(
      'practice profile heading',
      loose
        ? `${rel}: heading is '${loose.trim()}', expected '${HEADING_EN}' or '${HEADING_FI}'`
        : `${rel}: no practice-profile heading found`,
    );
    continue;
  }

  if (!headingSeen.has(found)) headingSeen.set(found, []);
  headingSeen.get(found).push(rel);
}

if (headingSeen.size > 1) {
  const summary = [...headingSeen.entries()]
    .map(([h, files]) => `'${h}' in ${files.length}`)
    .join(', ');
  fail(
    'practice profile heading',
    `domains disagree on the heading (${summary}) — practice-profile writes under one exact string`,
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nrepository invariants');
console.log('  rules checked: fork provenance, statute registry, statute watch, rename map,');
console.log('                 subagent naming, stale domain slugs, practice-profile heading\n');

if (staleInSkills > 0) {
  console.log(
    `  ⚠︎  ${staleInSkills} skill/reference file(s) still contain a pre-rename domain slug.\n` +
      '      Owned by the per-domain translation sessions; escalate to an error once translation lands.\n',
  );
}

for (const f of failures) console.log(`  ✗  ${f.rule}: ${f.detail}`);

if (failures.length === 0) {
  console.log('\n✓ Every stated invariant holds.\n');
  process.exit(0);
}

console.log(`\n✗ ${failures.length} invariant(s) violated.`);
console.log('  These are rules AGENTS.md states; this gate is what makes them real.\n');
process.exit(1);
