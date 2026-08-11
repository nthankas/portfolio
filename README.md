# Portfolio

Personal engineering portfolio for Nikhil Thankasala. Astro, zero client-side
JavaScript, one stylesheet.

```bash
npm install
npm run dev      # http://localhost:4321/portfolio
npm run build    # gap check, OG images, static build to dist/
npm run preview  # serve dist/
```

## Layout

```
src/
  site.config.ts        deploy target, owner identity, resume file
  content/projects/     one MDX file per project, typed frontmatter
  content.config.ts     the frontmatter schema
  data/                 experience, skills, repo index, FORTIS tables, videos
  lib/figures.ts        figure registry: image, alt text, caption, source
  components/           Figure, FigurePair, DataTable, Clip, ProjectEntry
  layouts/              Base, CaseStudy
  pages/                index.astro and the /work/* case studies
  styles/global.css     the whole design system, including the print stylesheet
scripts/
  check-gaps.mjs        lists unresolved fields; fails the build on placeholders
  make-og.mjs           generates Open Graph images from the site's typography
  pull-repos.mjs        refreshes the live GitHub data and reports drift
```

## Open Graph images

`public/og/*.png` are committed artifacts, one per route with a case study plus
one for the home page. They are laid out in HTML using the site's own font files
and palette, then screenshotted with headless Chromium, so a card cannot drift
from the site it advertises.

They are not regenerated during `npm run build`, so CI needs no browser. Run
`npm run og` after changing a project `title` or `thesis`, or after touching the
palette, and commit the result. Set `CHROMIUM_PATH` if Chromium lives outside
the Playwright cache. If no browser is available the script says so and exits
without touching the committed images.

## Adding a project

1. Create `src/content/projects/<slug>.mdx`. Copy the frontmatter block from an
   existing file; `src/content.config.ts` is the authority on which fields are
   required.
2. Set `priority`. It sorts the projects section, lowest first.
3. Write `thesis` as one sentence that leads with the constraint that made the
   work hard. It is the only prose in the collapsed card, so it has to stand
   alone.
4. Write the body. It renders inside the expanded card. Use `<DataTable>` for
   results, `<Figure>` for images, `<Clip>` for video.
5. If the project needs a full case study, set `caseStudy: <slug>` and add
   `src/pages/work/<slug>.astro` using the `CaseStudy` layout. The Open Graph
   image is generated automatically for any project with a `caseStudy` value.
6. Run `npm run build`.

Numbers that appear in both a card and a case study belong in `src/data/`, not
in both files. `src/data/fortis.ts` is the pattern: the tables are defined once
and spread into `<DataTable {...table} />` at each site.

## Adding a figure

Images live in `src/assets/figures/<project>/` and are optimized at build with
responsive `srcset` and explicit dimensions.

Register each one in `src/lib/figures.ts` with four fields:

- `file` path under `src/assets/figures/`
- `alt` what the figure shows, described as engineering content. Not the title
  again. A reader who cannot see the image should get the same information a
  reader who can see it gets.
- `caption` why the figure is on the page
- `source` where the image came from

Then use it: `<Figure id="my-figure" />`. Add `eager` on the first figure of a
route so it is not lazy-loaded.

Filenames in the original asset bundle do not reliably describe their contents.
Open every image before writing its alt text.

## Resolving a `needs_confirmation` field

Any content file whose frontmatter says `status: needs_confirmation` has one or
more fields the owner still has to settle. They are listed in that file's
`openQuestions` array, and `QUESTIONS.md` states each one in answerable form.
None of them render to the page: an unresolved field is a build-time warning,
never a visible badge.

To resolve one:

1. `npm run check:gaps` prints every unresolved field with the file it lives in.
2. Edit the content.
3. Delete the resolved entry from that file's `openQuestions`.
4. When the array is empty, change `status` to `confirmed`.
5. Update `ASSUMPTIONS.md` if the answer overturns a judgment call recorded
   there.

The build fails if any placeholder string (`TODO`, `FIXME`, an unfilled `{{slot}}`
and similar), an em dash, or an emoji reaches rendered copy. That check is the
first step of `npm run build`, so it cannot be skipped by accident.

## Publishing a demo video

`src/data/videos.ts` holds one entry per clip. Each renders its caption whether
or not the file exists, so an unpublished clip still tells the reader what was
demonstrated.

1. Encode a web-friendly MP4 and pull a poster frame from it:
   ```bash
   ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 24 -an out.mp4
   ffmpeg -i out.mp4 -ss 00:00:01 -frames:v 1 out.jpg
   ```
2. Put both in `public/video/`.
3. Set `file` and `poster` on the entry.

Players are `preload="none"` with a poster, muted, and never autoplay, so video
never affects first paint.

## Refreshing the GitHub data

```bash
npm run pull:repos
```

Rewrites `data/repos.json` from the live account and reports where
`src/data/repos.ts` has drifted: new repositories, changed push dates,
repositories that have disappeared. It does not rewrite `repos.ts`, because
every summary there was written from reading the source and cannot be
regenerated.

## Deploying

The deploy target is one edit, in `src/site.config.ts`:

| Target | `site` | `base` | `customDomain` |
| --- | --- | --- | --- |
| Pages project site | `https://nthankas.github.io` | `/portfolio` | `null` |
| Pages user site | `https://nthankas.github.io` | `/` | `null` |
| Custom domain | `https://example.com` | `/` | `'example.com'` |

Canonical URLs, Open Graph URLs, the sitemap, every asset path and the CNAME
file all derive from those values.

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. Before the first run, set repository Settings > Pages > Source to
GitHub Actions. For Vercel instead, set the framework preset to Astro, leave the
build command as `npm run build` and the output directory as `dist`, and set
`base` to `/`.

## Constraints this site holds to

- Zero client-side JavaScript on every route. Project cards are native
  `<details>`, so they expand without JS and their content stays in the DOM for
  in-page search and for print.
- Body text at 7:1 contrast or better, verified with axe at WCAG AAA.
- A print stylesheet that expands every disclosure and resolves link targets, so
  printing a case study produces a clean document.
