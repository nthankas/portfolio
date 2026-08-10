#!/usr/bin/env node
/**
 * Gap check.
 *
 * Two jobs:
 *
 *  1. List every field the owner still has to resolve, grouped by where it
 *     lives, so one answer can be applied without hunting.
 *  2. Fail the build if a placeholder string could ever reach a visitor.
 *
 * Run directly with `npm run check:gaps`. It also runs as part of `npm run
 * build`, before Astro, so a placeholder cannot be deployed.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

/**
 * Strings that must never render to a visitor. If one of these appears in
 * content, the build stops.
 */
const FORBIDDEN = [
  /\bTODO\b/,
  /\bTKTK\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /\bLOREM IPSUM\b/i,
  /\bPLACEHOLDER\b/i,
  /\bCOMING SOON\b/i,
  /\bINSERT [A-Z ]+HERE\b/i,
  // Unfilled template slots. Required to start with a letter so that real
  // nested array literals such as highlight={[[1, 1]]} are not flagged.
  /\[\[\s*[A-Za-z][^\]]*\]\]/,
  /\{\{\s*[A-Za-z][^}]*\}\}/,
];

/**
 * Blank out source comments while preserving line numbers, so a comment that
 * discusses these rules (or contains an em dash) is not mistaken for copy.
 * Only comment syntax is removed; string and template literals are kept,
 * because those do render.
 */
function stripComments(text) {
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
  return withoutBlocks
    .split('\n')
    .map((line) => {
      const t = line.trimStart();
      // Whole-line comments, including JSDoc continuation lines.
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('<!--')) return '';
      // Trailing line comments, ignoring the // inside a URL.
      return line.replace(/(^|[^:])\/\/.*$/, '$1');
    })
    .join('\n');
}

/**
 * Copy rules from the build brief that are cheap to enforce mechanically.
 * Em dashes and emoji are banned outright in rendered copy.
 */
const COPY_RULES = [
  { name: 'em dash', re: /—/ },
  { name: 'en dash used as an em dash', re: /\s–\s/ },
  {
    name: 'emoji',
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F900}-\u{1F9FF}]/u,
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const contentFiles = walk(SRC).filter((f) =>
  /\.(mdx?|astro|ts)$/.test(f) && !f.endsWith('check-gaps.mjs'),
);

// --------------------------------------------------------------- hard fails --

const violations = [];

for (const file of contentFiles) {
  const text = stripComments(readFileSync(file, 'utf8'));
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    if (!line.trim()) return;

    for (const re of FORBIDDEN) {
      if (re.test(line)) {
        violations.push({
          file: relative(ROOT, file),
          line: i + 1,
          kind: 'placeholder',
          detail: line.trim().slice(0, 100),
        });
      }
    }
    for (const rule of COPY_RULES) {
      if (rule.re.test(line)) {
        violations.push({
          file: relative(ROOT, file),
          line: i + 1,
          kind: rule.name,
          detail: line.trim().slice(0, 100),
        });
      }
    }
  });
}

// ------------------------------------------------------------ unresolved -----

/**
 * Frontmatter and data-file fields flagged `needs_confirmation`, pulled by
 * reading the files rather than by importing the collection, so this script
 * runs without an Astro build.
 */
function collectUnresolved() {
  const items = [];

  // Project frontmatter.
  const projectsDir = join(SRC, 'content', 'projects');
  for (const name of readdirSync(projectsDir)) {
    const text = readFileSync(join(projectsDir, name), 'utf8');
    const fm = text.split('---')[1] ?? '';
    if (!/status:\s*needs_confirmation/.test(fm)) continue;
    const title = (fm.match(/^title:\s*(.+)$/m) ?? [])[1] ?? name;
    const qs = [];
    const block = fm.match(/openQuestions:\n((?:\s*-\s.+\n)+)/);
    if (block) {
      for (const line of block[1].split('\n')) {
        const q = line.match(/^\s*-\s+(.+?)\s*$/);
        if (q) qs.push(q[1]);
      }
    }
    items.push({ where: `src/content/projects/${name}`, subject: title.trim(), questions: qs });
  }

  // Experience entries.
  const expPath = join(SRC, 'data', 'experience.ts');
  const exp = readFileSync(expPath, 'utf8');
  const orgs = [...exp.matchAll(/org:\s*'([^']+)'/g)].map((m) => m[1]);
  const blocks = exp.split(/\n\s*\{\n/).slice(1);
  blocks.forEach((b, i) => {
    if (!/status:\s*'needs_confirmation'/.test(b)) return;
    const qs = [];
    const qb = b.match(/openQuestions:\s*\[([\s\S]*?)\]/);
    if (qb) {
      for (const m of qb[1].matchAll(/'([^']+)'/g)) qs.push(m[1]);
    }
    items.push({
      where: 'src/data/experience.ts',
      subject: orgs[i] ?? `entry ${i + 1}`,
      questions: qs,
    });
  });

  // Video slots with no player at all (no local file AND no Drive id).
  const vids = readFileSync(join(SRC, 'data', 'videos.ts'), 'utf8');
  const entries = vids.split(/\n  \w+: \{/).slice(1);
  const dark = entries.filter(
    (e) => /file:\s*null/.test(e) && /drive:\s*null/.test(e),
  ).length;
  if (dark > 0) {
    items.push({
      where: 'src/data/videos.ts',
      subject: `${dark} demo clips with no player`,
      questions: ['Provide a Drive id or a local file for each'],
    });
  }
  if (/drive:\s*'/.test(vids)) {
    items.push({
      where: 'src/data/videos.ts',
      subject: 'Drive-embedded clips',
      questions: [
        'Confirm the Design Defense folder is shared as anyone-with-link, or the embeds show a request-access screen to visitors',
      ],
    });
  }

  // Deploy target and resume.
  const cfg = readFileSync(join(SRC, 'site.config.ts'), 'utf8');
  if (/customDomain:\s*null/.test(cfg)) {
    items.push({
      where: 'src/site.config.ts',
      subject: 'Deploy target',
      questions: ['Domain undecided; site and base are set to GitHub Pages defaults'],
    });
  }
  if (/file:\s*null as string \| null/.test(cfg)) {
    items.push({
      where: 'src/site.config.ts',
      subject: 'Resume file',
      questions: ['No resume PDF chosen; every resume link currently resolves to email'],
    });
  }

  return items;
}

const unresolved = collectUnresolved();

// ------------------------------------------------------------------ report --

console.log(`\n${BOLD}Gap check${RESET}`);
console.log(`${DIM}${'-'.repeat(64)}${RESET}`);

if (unresolved.length === 0) {
  console.log('No unresolved fields.');
} else {
  let count = 0;
  for (const item of unresolved) {
    console.log(`\n${YELLOW}needs_confirmation${RESET}  ${BOLD}${item.subject}${RESET}`);
    console.log(`  ${DIM}${item.where}${RESET}`);
    for (const q of item.questions) {
      console.log(`    - ${q}`);
      count += 1;
    }
  }
  console.log(
    `\n${YELLOW}${unresolved.length} subjects carry ${count} unresolved fields.${RESET}`,
  );
  console.log(`${DIM}See QUESTIONS.md for the full list in answerable form.${RESET}`);
}

if (violations.length > 0) {
  console.log(`\n${RED}${BOLD}Build blocked.${RESET}`);
  for (const v of violations) {
    console.log(`  ${RED}${v.kind}${RESET}  ${v.file}:${v.line}`);
    console.log(`    ${DIM}${v.detail}${RESET}`);
  }
  console.log(
    `\n${RED}${violations.length} issue(s) would render to a visitor or break a copy rule.${RESET}\n`,
  );
  process.exit(1);
}

console.log(`\n${DIM}No placeholder strings and no copy-rule violations.${RESET}\n`);
