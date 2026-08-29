# Polish 6 — cumulative adversarial review closure

Implementation commit: `3f71e14ee2de8424ad3571e87ffbd6d3e2906989`.
Deployment: `7224e977-8506-42a5-8e5f-b79f4fa55ee6` at
<https://bookmark-import-audit.sociobot.in>.

Every finding from reviews 1–6 was checked again. No prior closure statement was
treated as evidence. Tests named below passed from clean clone
`/tmp/bookmark-polish6-clean.H326YS`; the complete live suite passed 36/36 in
desktop Chromium and at 390 × 844.

Screenshot evidence:

- Home: `.factory/evidence/polish-6/live-root/screenshot-desktop.png`
- Demo: `.factory/evidence/polish-6/live-demo/screenshot-mobile.png`
- Offline: `.factory/evidence/polish-6/live-offline/screenshot-mobile.png`
- 404: `.factory/evidence/polish-6/live-404/screenshot-desktop.png`
- Route facts and hashes: `.factory/evidence/polish-6/live-route-summary.json`

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-led headline, named audience, first-screen sample action, result note, and real-file action inside both viewports. | `the complete primary action is visible at 1440 by 900`; home screenshot; live `/`. |
| F-1-2 | Kept `/?demo=1` and `/demo` in `demo:bookmark-import-audit`, with realistic seed, banner, reset, exit, and real-data isolation. | `@claim:demo-isolation`, `@claim:demo-exit-discard`; demo screenshot; live `/?demo=1`. |
| F-1-3 | Kept 15 registered claims with exactly one tagged test each. | `claim registry integrity`; all 15 exact commands; live demo. |
| F-1-4 | Kept browser-only file processing and complete request logging. | `@claim:local-processing`; demo screenshot; live `/?demo=1`. |
| F-1-5 | Kept bookmark-host traps and proved no bookmark URL is requested. | `@claim:local-processing`; demo screenshot; live `/?demo=1`. |
| F-1-6 | Kept offline reload and CSV export after the first visit. | `@claim:offline-reload`; offline/demo screenshots; live `/?demo=1`. |
| F-1-7 | Kept separate corrected-download wording and compared every source record. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-1-8 | Kept a realistic sample covering all four named issue categories. | `@claim:audit-categories`; demo screenshot; live `/?demo=1`. |
| F-1-9 | Kept same-named folders in separate paths plus blank-title and malformed-URL cases. | `@claim:audit-categories`; demo screenshot; live `/?demo=1`. |
| F-1-10 | Kept compatibility claims narrowed to choosing a bookmark HTML file exported from the browser. | `copy-audit.md`; home screenshot; live `/`. |
| F-1-11 | Kept exact 25 MiB picker/drop acceptance, one-byte rejection, and recovery. | `@claim:file-size-limit`; home screenshot; live `/`. |
| F-1-12 | Kept four named local checks and full request isolation. | `@claim:audit-categories`, `@claim:local-processing`; demo screenshot; live `/?demo=1`. |
| F-1-13 | Kept subjective safety language absent and repeatable URL rules under unit test. | `normalizes tracking parameters…`; home screenshot; live `/`. |
| F-1-14 | Kept visible http/https, www, and redirect-link cases without target requests. | `@claim:audit-categories`, `@claim:local-processing`; demo screenshot; live `/?demo=1`. |
| F-1-15 | Kept “full folder path” and compared every nested export path. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-1-16 | Kept every original URL, including tracking and anything-after-# variants. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-1-17 | Kept repairs limited to same-named folder labels and blank titles. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-1-18 | Kept exact CSV mapping for every displayed issue and required actions. | `@claim:csv-export`; demo screenshot; live `/?demo=1`. |
| F-1-19 | Kept real-audit refresh/forget behavior and separate disposable demo storage. | `@claim:real-audit-storage`, demo claims; demo screenshot; live `/` and `/?demo=1`. |
| F-1-20 | Kept obsolete license-storage and broad clear-everything promises absent. | privacy inventory/source scan; home screenshot; live `/privacy`. |
| F-1-21 | Kept the unsupported Plus worksheet absent. | source scan; home screenshot; live `/`. |
| F-1-22 | Kept unsupported entitlement copy absent. | copy audit; home screenshot; live `/`. |
| F-1-23 | Kept unregistered price and purchase UI absent. | live link crawl; home screenshot; live `/`. |
| F-1-24 | Kept dead checkout, merchant, refund, and revocation paths absent. | live link crawl; home screenshot; live `/`. |
| F-1-25 | Kept a dedicated analytics, script, font, resource, and cookie inventory. | `@claim:privacy-inventory`; demo screenshot; live `/?demo=1`. |
| F-1-26 | Kept obsolete license requests absent. | `@claim:privacy-inventory`; home screenshot; live `/`. |
| F-1-27 | Kept package engine metadata while leaving the unproved public Node-floor sentence absent. | clean-clone `npm ci`; home screenshot; live `/`. |
| F-1-28 | Kept `dist/index.html` and all documented outputs inventoried. | `@claim:build-output`; home screenshot; live `/`. |
| F-1-29 | Kept README commands concrete without an unsupported coverage promise. | clean-clone full suite; home screenshot; live `/`. |
| F-1-30 | Kept real static route documents and an HTTP 404 for unknown paths. | route test; 404 screenshot; live `/privacy`, `/terms`, `/round-6-missing`. |
| F-1-31 | Kept built and live cache policies asserted. | `@claim:delivery-config`; home screenshot; live asset headers. |
| F-1-32 | Kept CSP, permissions, anti-framing, nosniff, and referrer policies. | `@claim:delivery-config`; 404 screenshot; live route headers. |
| F-1-33 | Kept MIT license text and metadata tagged. | `@claim:license-metadata`; home screenshot; live `/terms`. |
| F-1-34 | Kept a product-styled, metadata-complete HTTP 404. | `@claim:designed-404`; 404 screenshot; live `/round-6-missing`. |
| F-1-35 | Completed metadata on every emitted HTML page, including offline: description, canonical, OG/Twitter, favicon, touch icon, and manifest. | `@claim:build-output`, route metadata test; offline screenshot; live `/offline.html`. |
| F-1-36 | Kept History API titles, H1 focus, announcements, Back, and Forward behavior. | `real routes set titles…`; home screenshot; live `/privacy` and `/terms`. |
| F-1-37 | Kept three method steps, factory/build footer, and the complete five-route sitemap. | `@claim:build-output`; home screenshot; live `/sitemap.xml`. |
| F-1-38 | Kept the full visible Bookmark Import Audit wordmark at 390 px. | `the 390px header visibly names…`; offline/demo screenshots; live `/`. |
| F-1-39 | Kept the direct “Bookmark import checker” category label. | copy audit; home screenshot; live `/`. |
| F-1-40 | Kept “Audit my bookmark HTML file” as the real-file action. | first-screen test; home screenshot; live `/`. |
| F-1-41 | Kept “bookmark HTML file” as the input term. | copy audit; home screenshot; live `/`. |
| F-1-42 | Kept deterministic and cleaned-URL jargon out of public and CSV copy. | source/copy scan; demo screenshot; live `/?demo=1`. |
| F-1-43 | Kept the useful “How the audit checks and preserves bookmarks” heading. | copy audit; home screenshot; live `/`. |
| F-1-44 | Kept “full folder path” as the single hierarchy term. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-1-45 | Kept URL differences in plain http/https, www, tracking, and redirect-link language. | `@claim:audit-categories`; demo screenshot; live `/?demo=1`. |
| F-1-46 | Kept the unsupported paid section absent. | source scan; home screenshot; live `/`. |
| F-1-47 | Kept audit, issue, bookmark app, bookmark HTML file, and full folder path consistent. | copy audit; home/demo screenshots; live routes. |
| F-1-48 | Kept every audited sentence within 22 words and concrete output/cache wording. | `copy-audit.md`; home screenshot; live `/`. |
| F-1-49 | Kept “Install update” as the update action. | full browser suite; home screenshot; live `/`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept every demo-to-real transition destructive only to demo storage; the next demo starts from the shipped seed. | `@claim:demo-exit-discard`; demo screenshot; live `/?demo=1`. |
| F-2-2 | Kept arbitrary missing URLs as CSP-clean, metadata-complete HTTP 404 responses. | `@claim:designed-404`; 404 screenshot; live `/round-6-missing`. |
| F-2-3 | Kept guidance and both error paths at 25 MiB. | `@claim:file-size-limit`; home screenshot; live `/`. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept the complete primary action above the 1440 × 900 fold. | first-screen bounding-box test; home screenshot; live `/`. |
| F-3-2 | Kept all visible 390 px controls at least 44 × 44 CSS pixels, including the offline shell. | mobile target test; offline/demo screenshots; live routes. |
| F-3-3 | Kept one actionable CSV row for every displayed finding. | `@claim:csv-export`; demo screenshot; live `/?demo=1`. |
| F-3-4 | Kept complete corrected-export comparison for URLs, paths, folders, and titles. | `@claim:corrected-export`; demo screenshot; live `/?demo=1`. |
| F-3-5 | Kept delivery checks against the built artifact. | `@claim:delivery-config`; 404 screenshot; live host. |
| F-3-6 | Kept the privacy inventory as a dedicated registered claim. | `@claim:privacy-inventory`; demo screenshot; live `/?demo=1`. |
| F-3-7 | Kept the unproved public Node-version sentence absent. | README scan; home screenshot; live `/`. |
| F-3-8 | Expanded the registered output inventory to every HTML page, offline assets, manifest, worker, sitemap, icon, and host config. | `@claim:build-output`; offline screenshot; live `/offline.html`. |
| F-3-9 | Kept direct browser-export input guidance. | copy audit; home screenshot; live `/`. |
| F-3-10 | Kept the first-screen promise of a separate corrected download. | `@claim:corrected-export`; home screenshot; live `/`. |
| F-3-11 | Kept designed 404 behavior registered. | `@claim:designed-404`; 404 screenshot; live `/round-6-missing`. |
| F-3-12 | Kept the unnecessary browser pre-script promise absent. | README scan; home screenshot; live `/`. |
| F-3-13 | Kept exact one-tag-per-claim registry enforcement. | `claim registry integrity`; demo screenshot; live demo. |
| F-3-14 | Kept picker/drop validation and recovery in one tested path. | `@claim:file-size-limit`; home screenshot; live `/`. |
| F-3-15 | Kept demo copy naming the saved audit. | copy audit; demo screenshot; live `/?demo=1`. |
| F-3-16 | Kept reader storage language as “this browser.” | copy audit; home screenshot; live `/privacy`. |
| F-3-17 | Kept “anything after #” in public matching copy. | copy audit; demo screenshot; live `/?demo=1`. |
| F-3-18 | Kept http/https instead of protocol jargon. | copy audit; demo screenshot; live `/?demo=1`. |
| F-3-19 | Kept bookmark HTML file terminology throughout. | copy audit; home screenshot; live `/`. |
| F-3-20 | Kept scripts, styles, images, and icons named in cache documentation. | `@claim:delivery-config`; home screenshot; live asset headers. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Kept the demo free of the landing hero and immediately populated with file, gauges, categories, and both exports. | post-click viewport test; demo screenshot; live `/?demo=1`. |
| F-4-2 | Kept generic importer behavior out of claims and fixture-scoped Chrome 145 guidance. | `@claim:destination-profile`; demo screenshot; live `/?demo=1` and `/terms`. |
| F-4-3 | Kept “anything after #” in landing, results, README, and CSV text. | copy/source scan; demo screenshot; live `/?demo=1`. |
| F-4-4 | Kept the data-specific privacy heading. | copy audit; home screenshot; live `/`. |
| F-4-5 | Kept Demo, Privacy, Terms, offline, metadata, and host outputs concrete in README. | `@claim:build-output`; offline screenshot; live `/offline.html`. |
| F-4-6 | Kept concrete cached file types in README. | `@claim:delivery-config`; home screenshot; live asset headers. |
| F-4-7 | Kept Generic audit and the versioned Chrome 145 profile with narrow severity/checklist/CSV behavior. | `@claim:destination-profile`; demo screenshot; live `/?demo=1`. |

## Review 5 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Kept the full product name visible beside the BIA mark at 390 px; the offline shell uses the same treatment. | visible-wordmark test; offline/demo screenshots; live `/` and `/offline.html`. |

## Review 6 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-35 | Added full route metadata and identity assets to the offline document, then inventoried metadata on all six emitted HTML pages. | `@claim:build-output`, route metadata test; offline screenshot; live `/offline.html`. |
| F-6-1 | Added the standard skip link, product header, Audit/Demo/Privacy navigation, legal footer, factory credit, and build ID to the offline page. | route-shell and mobile-target tests; offline screenshot; live `/offline.html`. |
| F-6-2 | Added `src/release.ts` as the only build-ID source; the build injects it into script-free pages and tests app/static output plus every live footer. | `@claim:build-output`, route/build test; offline and 404 screenshots; live route summary. |

## Final evidence

- All 15 exact claim commands: PASS from the clean clone.
- `npm test`: PASS, 15/15.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` created.
- Clean-clone `npm run test:e2e`: PASS, 36/36.
- Deployed `npm run test:e2e`: PASS, 36/36.
- URL verifier: PASS on home, demo, offline, and `/404`, with no console error.
- Axe integration: zero serious or critical violations on every tested route.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 10 ms, CLS 0.
- Live JavaScript, CSS, offline HTML, and 404 HTML SHA-256 values match the
  deployed local build.

No finding is deferred and no TODO remains.
