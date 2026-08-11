#!/usr/bin/env node
/**
 * Refresh the live repository data.
 *
 * Writes data/repos.json, then reports where src/data/repos.ts has drifted from
 * the live account (last-push dates, new repositories, repositories that have
 * disappeared). It does not rewrite repos.ts, because every summary in that file
 * is written from reading the source and cannot be regenerated automatically.
 *
 * Usage:  npm run pull:repos
 *
 * Needs a token only for private repositories:
 *   GITHUB_TOKEN=ghp_... npm run pull:repos
 */

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const USER = 'nthankas';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-build',
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100`, { headers });
if (!res.ok) {
  console.error(`GitHub API returned ${res.status} ${res.statusText}`);
  process.exit(1);
}

const repos = await res.json();
if (!Array.isArray(repos)) {
  console.error('Unexpected API response:', repos);
  process.exit(1);
}

const live = repos
  .filter((r) => !r.fork && !r.archived)
  .map((r) => ({
    name: r.name,
    url: r.html_url,
    language: r.language,
    pushed: r.pushed_at.slice(0, 10),
    description: r.description,
  }))
  .sort((a, b) => b.pushed.localeCompare(a.pushed));

mkdirSync(join(ROOT, 'data'), { recursive: true });
writeFileSync(join(ROOT, 'data', 'repos.json'), JSON.stringify(live, null, 2));
console.log(`Wrote data/repos.json (${live.length} repositories).`);

// -------------------------------------------------------------- drift check --

const tracked = readFileSync(join(ROOT, 'src', 'data', 'repos.ts'), 'utf8');
const trackedNames = [...tracked.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1]);
const trackedPushed = Object.fromEntries(
  [...tracked.matchAll(/name:\s*'([^']+)'[\s\S]*?pushed:\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);

// Repositories carrying a full project entry are intentionally absent from the
// index, so they are not reported as missing.
const carded = new Set(['FORTIS', 'WallE_Robot', 'Battleships', 'EmbeddedFilterWithEEPROM']);

let drift = 0;
for (const repo of live) {
  if (carded.has(repo.name)) continue;
  if (!trackedNames.includes(repo.name)) {
    console.log(`  new repository, not in the index: ${repo.name} (${repo.pushed})`);
    drift += 1;
  } else if (trackedPushed[repo.name] !== repo.pushed) {
    console.log(
      `  last push changed: ${repo.name} ${trackedPushed[repo.name]} -> ${repo.pushed}`,
    );
    drift += 1;
  }
}
for (const name of trackedNames) {
  if (!live.some((r) => r.name === name)) {
    console.log(`  in the index but not in the live pull: ${name}`);
    drift += 1;
  }
}

console.log(drift === 0 ? 'Index matches the live pull.' : `${drift} difference(s) to reconcile.`);
