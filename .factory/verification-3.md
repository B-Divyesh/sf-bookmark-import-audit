# Independent verification 3 — candidate `9469d87650f9375e815e2858fdd2cc493fd2d612`

**Result: FAIL.** The candidate is not releasable because one required claim
command fails from the clean checkout. A separate PWA update defect also leaves
stable-name assets stale after an asset-only deployment.

Verified independently on 2026-08-29 against:

- candidate: `9469d87650f9375e815e2858fdd2cc493fd2d612`;
- live URL: <https://bookmark-import-audit.sociobot.in/>;
- Node 22.23.2, npm 10.9.8, Playwright 1.58.2, Chromium 145;
- initially clean `main` checkout exactly matching `origin/main`;
- no product code changes.

## Release blockers and defects

### High — V3-1: required `file-size-limit` claim command fails

The exact registered command is:

```sh
npm run test:e2e -- --grep @claim:file-size-limit
```

After `npm ci`, it ran the desktop and 390 px projects in parallel. Desktop
passed, but mobile timed out after 30 seconds in
`locator('#bookmark-file').setInputFiles(...)` at `tests/e2e/app.spec.ts:253`.
The exact claims run therefore finished with one failed claim command. The full
local suite reproduced the same failure and ended `35 passed, 1 failed`.

The live full suite also failed this claim: desktop timed out at the 25 MiB
upload and mobile timed out waiting for the over-limit recovery message. It
ended `34 passed, 2 failed`.

This is a test-harness/concurrency defect rather than evidence that the deployed
file boundary is wrong. An independent test used real temporary files instead
of transferring two 25 MiB in-memory buffers through Playwright at once:

| Viewport | Exactly 25 MiB | 25 MiB + 1 byte |
| --- | ---: | ---: |
| Desktop 1440 px | accepted in 289 ms | rejected in 107 ms |
| Mobile 390 px | accepted in 209 ms | rejected in 119 ms |

The mobile claim test also passed alone (`1 passed`, 12.6 seconds). However,
the acceptance contract explicitly makes any failing registered claim command
release-blocking. Make the fixture a temporary file path or serialize this
large-payload test, then make the exact registry command pass reliably.

### Medium — V3-2: asset-only PWA updates can stay stale indefinitely

`vite.config.ts:69-74` derives the service-worker cache version only from the
list of output filenames, not their contents. Meanwhile,
`public/staticwebapp.config.json:15-27` sends one-year `immutable` caching for
all `/assets/*` and `/icons/*`, including stable names such as
`migration-console-800.webp`.

Independent update probe:

1. Installed and controlled a clean copy of the production PWA.
2. Replaced the served bytes at `/assets/migration-console-800.webp` while
   keeping the filename and generated worker unchanged.
3. Called `registration.update()` and reloaded.
4. No waiting worker appeared. The controlled page continued to receive SHA-256
   `3d191d5b...e382ce2`; the server held `2fa3238a...71584c`.

This also makes the README sentence “Browsers check pages for updates and cache
uniquely named scripts, styles, images, and icons for one year” broader than any
registered claim and false for changed stable-name images. Fingerprint those
files, include file contents in the worker version, or stop marking stable URLs
immutable. Register the update behavior as a claim.

### Low — V3-3: first-screen facts omit the tested offline capability

The prescribed first-screen fact set calls for privacy, offline use, and price.
The live facts are two privacy statements plus corrected-copy output. The app
has a passing offline claim, but the first screen does not say it works offline.
There is no paid offer, so no price is shown.

## Mandatory first-read gate

**PASS.** On a cold 1440 × 900 visit, without scrolling:

- what it does: “Check bookmarks before you import” and finds same-named
  folders and duplicate links;
- for whom: people moving an old bookmark library;
- first click: **Try it with sample data**;
- one-click demo: the action is visible at 652 px and opens a populated audit.

The adjacent sentence says the demo shows a completed audit and never replaces
the saved audit. The cold page returned 200 with no console or page errors.

## Claims registry

`.factory/claims.json` exists and contains 15 entries. Every exact `test` value
was run independently after the lockfile install.

| Claim | Exact-command result |
| --- | --- |
| `demo-isolation` | PASS — 2 browser projects |
| `demo-exit-discard` | PASS — 2 browser projects |
| `audit-categories` | PASS — 2 browser projects |
| `destination-profile` | PASS — 2 browser projects |
| `csv-export` | PASS — 2 browser projects |
| `corrected-export` | PASS — 2 browser projects |
| `local-processing` | PASS — 2 browser projects |
| `privacy-inventory` | PASS — 2 browser projects |
| `offline-reload` | PASS — 2 browser projects |
| `file-size-limit` | **FAIL — mobile timeout; desktop passed** |
| `real-audit-storage` | PASS — 2 browser projects |
| `delivery-config` | PASS — 1 selected unit test |
| `build-output` | PASS — 1 selected unit test |
| `designed-404` | PASS — 2 browser projects |
| `license-metadata` | PASS — 1 selected unit test |

## Clean install, checks, and production build

```text
npm ci             PASS — 142 packages; 0 vulnerabilities
npm test           PASS — 15/15 Vitest tests
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — exact Vite production build created dist/
npm run test:e2e   FAIL — 35/36; V3-1
live test:e2e      FAIL — 34/36; V3-1 in both projects
```

The production build emits 27,360 bytes of JavaScript (9,698 gzip), 21,236
bytes of CSS (5,631 gzip), and a 23,028-byte mobile hero image. All are well
inside the static-product budgets.

## Product exercise

A custom nested Netscape bookmark file was audited on desktop and 390 px. It
contained same-named `Research` folders under two parents, tracking-fragment
duplicates, a blank title, and a malformed URL. Both viewports reported four
issues, showed the matching finding sections, recovered after invalid HTML, and
downloaded `representative-corrected.html` plus
`representative-review.csv`. The registered export tests additionally proved
all URLs and nesting paths are retained and every displayed issue has an
actionable CSV row.

Scale probes completed without errors:

- 10,000 unique bookmarks: 795 ms, zero issues;
- 5,000 duplicate bookmarks: 1,189 ms, one cluster, 20,149 DOM elements.

Demo reset/exit isolation, destination profile changes, saved-audit refresh and
forget behavior, malformed input, oversized picker/drop errors, and recovery
all worked when run outside the failing parallel buffer transfer.

## Accessibility, responsive behavior, and interaction

- Axe integration: zero serious or critical findings on home, demo, Privacy,
  Terms, offline, and HTTP 404 in desktop and mobile projects.
- Semantic checks: each route has `lang=en`, one `main`, one `h1`, ordered
  headings, a skip link, header/navigation, and footer.
- Keyboard-only flow reached the skip link, sample demo, destination selector,
  and CSV export. Enter activated the demo and downloaded the CSV.
- Focus is a visible 3 px ring. Measured contrast is 4.70:1 on paper and 6.65:1
  for the file control on its panel.
- Reduced motion changes transitions to 0.01 ms and removes decorative
  transforms.
- Every tested mobile target is at least 44 × 44 CSS px. All routes had no
  horizontal overflow at 390 px or at a 640 px layout equivalent to 200% zoom
  on a 1280 px desktop viewport.
- No non-404 console error or uncaught page error occurred.

## Privacy, network, and headers

The complete demo/reset/export claim flow and the independent real-file flow
made only same-origin requests. No bookmark host, analytics endpoint, remote
font/script, billing endpoint, or other third party was requested. There were
no cookies. The bundle contains no billing URL or license-storage string; the
unused source license module is not imported. There is no sign-in and no
server-side product endpoint, so authentication, persistence concurrency, and
429 allowance checks are not applicable.

Live HTML responses include CSP, HSTS, `Permissions-Policy`,
`Referrer-Policy`, `X-Content-Type-Options`, and `X-Frame-Options`. Hashed JS/CSS
return `public, max-age=31536000, immutable`; HTML, manifest, and worker return
`public, max-age=0, must-revalidate`. An unknown path returns the styled document
with HTTP 404.

## Deployment identity, PWA, and performance

- Every one of the 23 deployable `dist` files byte-matches the live URL by
  SHA-256. `staticwebapp.config.json` is host configuration and is not served.
- Chromium parsed the web manifest with no errors and found 192 px, 512 px, and
  maskable icons.
- Offline demo reload and CSV export passed in both projects after an online
  service-worker install.
- A changed-worker probe produced the visible “An app update is ready” prompt;
  **Install update** activated it and reloaded under the new controller.
- The separate stable-asset update path fails as described in V3-2.
- Fresh live mobile Lighthouse at 2026-08-29 05:24 UTC: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s,
  TBT 0 ms, CLS 0.

## Final severity count

- Critical: 0
- High: 1
- Medium: 1
- Low: 1

Release only after the exact claim registry is green and the PWA asset update
path is corrected and covered by a registered claim.
