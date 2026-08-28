# Handoff — polish 1

## Outcome

Repair commit: `2cb45ffea83d2d53d1fa59df1ab9944b39859b52` on `main`, pushed to
`origin/main` from this work order. It closes review findings F-1-1 through
F-1-49; the detailed finding-to-change evidence is in `.factory/polish-1.md`.

The release keeps the mid-century migration-console visual identity. It now has
a first-screen direct demo action, isolated `/demo` and `?demo=1` paths, route
metadata and navigation focus handling, product-specific 404 page, real export
and privacy claims, and a 390px-tested layout. Unsupported paid checkout and
license promises were removed because their registered checkout endpoint was
not live.

## Verification

Ran from a clean `npm ci` dependency install:

```text
npm test                                      PASS — 11 tests
npm run lint                                  PASS
npm run typecheck                             PASS
npm run build                                 PASS — dist/index.html
npm run test:e2e                              PASS — 20 tests (desktop + 390px)
npm test -- -t @claim:delivery-config         PASS
npm test -- -t @claim:license-metadata        PASS
all eight Playwright claim commands           PASS — 2 projects each
```

The eight browser claim commands were run exactly as listed in
`.factory/claims.json`: demo isolation, audit categories, CSV export, corrected
export, local processing, offline reload, 25 MiB file boundary, and real-audit
storage. `@claim:file-size-limit` was rerun after making the accepted fixture
exactly 25 MiB; it passed in both projects.

Accessibility/privacy smoke evidence on the local production build at `/demo`:

```json
{"title":"Demo — Bookmark Import Audit","lang":"en","mains":1,"h1s":1,"imagesWithoutAlt":0,"consoleErrors":[]}
```

The Playwright axe integration found zero serious or critical violations. The
offline claim reloads `/demo` after service-worker readiness with the browser
offline and exports CSV. The privacy claim records every request, checks the
sample bookmark trap domains are absent, and verifies no cookies or external
scripts. Screenshots: `/tmp/bookmark-home-desktop.png` and
`/tmp/bookmark-demo-mobile.png`.

Build budgets: initial JavaScript is 24.78 kB (8.89 kB gzip), and CSS is
18.82 kB (5.23 kB gzip). The generated social preview is 110,778 bytes.

## Deployment status

`git push origin main` completed successfully. At 2026-08-28 23:53 UTC the
configured live URL still returned the old candidate title and `/404` returned
HTTP 200, so the factory static deployment had not propagated the pushed commit
yet. This repository contains no work-order deployment command or deployment
credential, and repository rules prohibit infrastructure changes. The next
factory deployment should publish commit `2cb45ff`; recheck `/`, `/demo`,
`/privacy`, `/terms`, and a missing URL cold after propagation.

## Run locally

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/demo` for the isolated sample audit.
