#!/usr/bin/env node
/**
 * Open Graph image generation.
 *
 * Each card is laid out in HTML using the site's own font files, palette and
 * layout register (hairline rules, letterspaced label, monospace title), then
 * screenshotted with headless Chromium. No template and no external service.
 *
 * Rendering in a browser rather than an SVG rasterizer is deliberate: the
 * rasterizers either silently fall back to a system font or truncate long
 * glyph-path data, and both failures are quiet. Chromium shapes text the same
 * way the live page does, so a card cannot drift from the site it advertises.
 *
 * The generated PNGs are committed. CI does not regenerate them, so a browser
 * is only needed on the machine that changes a title or thesis:
 *
 *   npm run og
 *
 * If Chromium is missing, this exits with a message and leaves the committed
 * images in place rather than shipping broken ones.
 *
 * Output: public/og/<slug>.png at 1200x630.
 */

import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public', 'og');
mkdirSync(OUT, { recursive: true });

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Open Graph images not regenerated: playwright is not installed.');
  console.error('Run `npm install` and `npx playwright install chromium`, then `npm run og`.');
  process.exit(0);
}

const W = 1200;
const H = 630;

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function page({ kind, title, summary, chips }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  :root {
    --paper: #f7f8f9;
    --ink: #14171a;
    --muted: #464d53;
    --rule: #d5d9dd;
    --wash: #eceef0;
    --accent: #0a4488;
  }

  * { box-sizing: border-box; margin: 0; }

  body {
    width: ${W}px; height: ${H}px;
    background: var(--paper);
    padding: 56px 80px 44px;
    display: flex; flex-direction: column;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .label {
    font-family: 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 18px; font-weight: 400;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--muted);
    padding-bottom: 14px;
    border-bottom: 2px solid var(--ink);
  }

  h1 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: ${title.length > 22 ? 58 : 76}px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-top: 68px;
  }

  .summary {
    font-size: 27px; line-height: 1.45;
    color: var(--muted);
    margin-top: 26px;
    /* Never more than four lines; the card is a summary, not the page. */
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .chips {
    margin-top: auto;
    display: flex; gap: 10px;
    overflow: hidden; height: 38px;
  }

  .chips span {
    font-family: 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 19px; color: var(--muted);
    background: var(--wash); border: 1px solid var(--rule);
    padding: 5px 13px; white-space: nowrap;
  }

  footer {
    margin-top: 22px; padding-top: 18px;
    border-top: 1px solid var(--rule);
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 18px;
  }

  footer .mark { display: flex; align-items: center; gap: 10px; font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 20px; color: var(--ink); }
  footer .tag { color: var(--muted); }
  .dot { color: var(--accent); }
</style></head>
<body>
  <div class="label">${esc(kind)}</div>
  <h1>${esc(title)}</h1>
  <p class="summary">${esc(summary)}</p>
  <div class="chips">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
  <footer>
    <span class="mark"><svg width="34" height="34" viewBox="0 0 40 40" fill="none"><path d="M13 4 H27 L36 13 V27 L27 36 H13 L4 27 V13 Z" stroke="#14171a" stroke-width="2"/><line x1="7.5" y1="4.7" x2="4.7" y2="7.5" stroke="#0a4488" stroke-width="2.4"/><line x1="32.5" y1="4.7" x2="35.3" y2="7.5" stroke="#0a4488" stroke-width="2.4"/><line x1="4.7" y1="32.5" x2="7.5" y2="35.3" stroke="#0a4488" stroke-width="2.4"/><line x1="35.3" y1="32.5" x2="32.5" y2="35.3" stroke="#0a4488" stroke-width="2.4"/><text x="20" y="25.5" text-anchor="middle" font-size="13.5" font-weight="700" font-family="Arial" fill="#14171a">NT</text></svg>Nikhil Thankasala</span>
    <span class="tag">robotics software<span class="dot">.</span></span>
  </footer>
</body></html>`;
}

// ---------------------------------------------------------------- inputs ----

function frontmatter(raw) {
  const fm = raw.split('---')[1] ?? '';
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
  };
  const list = (key) => {
    const block = fm.match(new RegExp(`^${key}:\\n((?:\\s+-\\s.+\\n)+)`, 'm'));
    if (!block) return [];
    return [...block[1].matchAll(/^\s+-\s+(.+?)\s*$/gm)].map((m) =>
      m[1].replace(/^['"]|['"]$/g, ''),
    );
  };
  return { get, list };
}

const cards = [
  {
    slug: 'index',
    kind: 'Robotics software engineer',
    title: 'Nikhil Thankasala',
    summary:
      'Software architecture, simulation, perception and state estimation for physical systems that have to work inside constraints someone else fixed.',
    chips: ['ROS 2', 'Isaac Sim', 'Python', 'C', 'Docker', 'Jetson'],
  },
];

const projectsDir = join(ROOT, 'src', 'content', 'projects');
for (const file of readdirSync(projectsDir)) {
  const { get, list } = frontmatter(readFileSync(join(projectsDir, file), 'utf8'));
  const slug = get('caseStudy');
  if (!slug) continue;
  cards.push({
    slug,
    kind: 'Case study',
    title: get('title'),
    summary: get('thesis'),
    chips: list('stack'),
  });
}

// --------------------------------------------------------------- rasterize --

const launchOptions = { args: ['--no-sandbox'] };
if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;

let browser;
try {
  browser = await chromium.launch(launchOptions);
} catch (err) {
  console.error('Open Graph images not regenerated: could not launch Chromium.');
  console.error(String(err).split('\n')[0]);
  console.error('Run `npx playwright install chromium`, or set CHROMIUM_PATH.');
  process.exit(0);
}

const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});
const tab = await context.newPage();

for (const card of cards) {
  await tab.setContent(page(card), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(OUT, `${card.slug}.png`) });
}

await browser.close();

console.log(`Generated ${cards.length} Open Graph images:`);
for (const c of cards) console.log(`  public/og/${c.slug}.png`);
