# Handoff — Polish 7 complete

## Outcome

Repair commit `da12853` closes every remaining adversarial-review finding. The
live static PWA is deployed at <https://bookmark-import-audit.sociobot.in>.

- F-7-1 / F-1-41 / F-1-47 / F-3-19: the empty-export recovery now says
  “Export your bookmarks as a bookmark HTML file, then choose that file.” A
  two-viewport Playwright regression test exercises the error on the live host.
- F-7-2: `/offline.html` is now in `sitemap.xml`; the exact built-route
  inventory assertion protects it.

The catalog line is now verb-first and 75 characters:
“Check bookmark HTML for duplicate links and folder conflicts before import.”

See `.factory/polish-7.md` for the finding-by-finding closure map.

## Exact verification

Clean clone: `/tmp/bookmark-polish7-clean.UunIGi` at `da12853`.

- `npm ci`: PASS — 142 packages, 0 vulnerabilities.
- Every one of the 16 exact commands in `.factory/claims.json`: PASS.
- `npm test`: PASS — 16 tests.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS — `dist/` created.
- Clean-clone `npm run test:e2e`: PASS — 40 checks across desktop Chromium and
  390 × 844 Chromium.
- Deployed `PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e`:
  PASS — 40 checks, including axe serious/critical, keyboard/focus, mobile
  targets, privacy request inventory, offline reload/export, demo isolation,
  metadata, navigation, and 404 behavior.
- Factory URL verifier: PASS on `/`, `/?demo=1`, and `/offline.html`; each has
  `lang=en`, one H1, a main landmark, named controls, image alternatives, and
  no console error. Reports and screenshots are in
  `.factory/evidence/polish-7/`.
- Cold missing-route check: `/polish-7-missing` returned HTTP 404 with the
  designed document, correct title, one H1/main, and home action. Headers are
  in `.factory/evidence/polish-7/live-404/headers.txt`.
- Lighthouse mobile, live root: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. The report is
  `.factory/evidence/polish-7/lighthouse-live.json`.

The first-load JS is 27.37 kB raw / 9.70 kB gzip and CSS is 21.24 kB raw /
5.63 kB gzip. Both remain within the static PWA budgets.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Deploy `dist/` as the configured static site. The product remains a local-first
PWA: bookmark data is processed in the browser; demo data is stored separately;
the service worker supports offline use after the first visit.

## Known gaps

None. No review item, TODO, untested visitor claim, or deployment follow-up is
left open.
