# Polish 5 — cumulative adversarial review closure

Repair commits: `b0f52cfae613f809dee572b88824ef2e1d0c46af` (restored the
wordmark and regression test) and `4960a9262521bb14e245508f16b847c128bb9218`
(final legible mobile-header reflow). Final deployment:
`91e5d8ff-1eef-46d7-90be-2634738686fc` at
<https://bookmark-import-audit.sociobot.in>.

This round closes the sole regression in review 5 and re-verifies every earlier
finding rather than treating a previous closure as evidence. The product keeps
its mid-century migration-console visual system. Its mobile header is compact,
but the visible wordmark remains **Bookmark Import Audit** beside the instrument
mark.

Evidence assets:

- `.factory/evidence/polish-5/mobile-header-390-local.png`
- `.factory/evidence/polish-5/mobile-header-390-live-final.png`
- `.factory/evidence/polish-5/live-verification.json`
- `.factory/evidence/polish-5/lighthouse-live-final.json`

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct job headline, audience sentence, sample action, result note, and real-file action in the cold first screen. | `the complete primary action is visible at 1440 by 900`; live `/`. |
| F-1-2 | Kept `?demo=1` and `/demo` as isolated `demo:bookmark-import-audit` storage with realistic seed, banner, reset, and Start for real. | `@claim:demo-isolation`, `@claim:demo-exit-discard`; live `/?demo=1`. |
| F-1-3 | Kept `.factory/claims.json` with one unique tagged test for every claim. | `claim registry integrity`; all 15 registry commands from clean clone. |
| F-1-4 | Kept the browser-only processing promise and a request-log assertion. | `@claim:local-processing`; live `/?demo=1`. |
| F-1-5 | Kept bookmark-host trap URLs and proved that no bookmark URL is requested. | `@claim:local-processing`; live `/?demo=1`. |
| F-1-6 | Kept the offline promise with an offline reload and CSV export test. | `@claim:offline-reload`; live `/?demo=1`. |
| F-1-7 | Kept separate-download wording and complete record comparison for corrected HTML. | `@claim:corrected-export`; live demo export. |
| F-1-8 | Kept the eight-bookmark sample that produces every named issue category. | `@claim:audit-categories`; live `/?demo=1`. |
| F-1-9 | Kept same-named folders in separate locations and a malformed URL sample. | `@claim:audit-categories`; parser unit suite. |
| F-1-10 | Kept the narrowed input wording: bookmark HTML file exported from the browser. | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Kept a 25 MiB limit with exact acceptance, one-byte rejection, and recovery. | `@claim:file-size-limit`; live upload control. |
| F-1-12 | Kept four named local checks and same-origin request isolation. | `@claim:audit-categories`, `@claim:local-processing`; live demo. |
| F-1-13 | Kept subjective matching language out of visitor copy and normalized URLs under unit test. | `tests/unit/audit.test.ts`; `.factory/copy-audit.md`. |
| F-1-14 | Kept visible http/https, www, and redirect-link wording without fetching targets. | `@claim:audit-categories`, `@claim:local-processing`; live demo. |
| F-1-15 | Kept “full folder path” terminology and compared every nested output path. | `@claim:corrected-export`; live demo export. |
| F-1-16 | Kept every original URL, including tracking and anything-after-# variants, in corrected HTML. | `@claim:corrected-export`; live demo export. |
| F-1-17 | Kept the limited repairs: merge-prone folder labels and blank titles only. | `@claim:corrected-export`; live demo repair ledger. |
| F-1-18 | Kept CSV header, displayed-finding mapping, and required suggested actions. | `@claim:csv-export`; live demo CSV export. |
| F-1-19 | Kept real-audit refresh/forget storage and demo separation. | `@claim:real-audit-storage`, `@claim:demo-isolation`; live root and demo. |
| F-1-20 | Kept obsolete license-storage and broad clear-everything promises absent. | source/copy scan; live `/privacy`. |
| F-1-21 | Kept the unsupported Plus worksheet absent. | source scan; live `/`. |
| F-1-22 | Kept unsupported free-tier entitlement wording absent. | `.factory/copy-audit.md`; live `/`. |
| F-1-23 | Kept unregistered price and purchase UI absent. | link crawl; live `/`. |
| F-1-24 | Kept dead checkout, merchant, refund, and revocation wording absent. | link crawl; live `/`. |
| F-1-25 | Kept a dedicated request, script, font, resource, and cookie inventory claim. | `@claim:privacy-inventory`; live `/?demo=1`. |
| F-1-26 | Kept the obsolete license request path absent. | source scan; live request inventory. |
| F-1-27 | Kept package engine metadata and removed an unproved public Node support promise. | clean-clone `npm ci`; `package.json`; README scan. |
| F-1-28 | Kept a built-output inventory that requires `dist/index.html` and all documented artifacts. | `@claim:build-output`; clean build. |
| F-1-29 | Kept runnable README commands without an unsupported coverage claim. | README; clean-clone full suite. |
| F-1-30 | Kept direct static documents for routes and an HTTP 404 for unknown paths. | route suite; live `/privacy`, `/terms`, `/does-not-exist`. |
| F-1-31 | Kept cache policy in the built host configuration. | `@claim:delivery-config`; live response headers. |
| F-1-32 | Kept CSP, permissions, nosniff, referrer, and anti-framing policies. | `@claim:delivery-config`; live response headers. |
| F-1-33 | Kept MIT license metadata and the tagged content assertion. | `@claim:license-metadata`; `LICENSE`. |
| F-1-34 | Kept the product-styled, metadata-complete, CSP-clean HTTP 404. | `@claim:designed-404`; live `/does-not-exist`. |
| F-1-35 | Kept route metadata, social preview, favicon, and decoded 180 × 180 Apple touch icon. | `@claim:build-output`; live root and 404 asset check. |
| F-1-36 | Kept History API navigation, polite route announcement, and H1 focus on navigation. | `real routes set titles, metadata, history focus, announcements, and working legal links`; live route check. |
| F-1-37 | Kept method steps, factory/build footer, and the complete five-route sitemap. | `@claim:build-output`; live `/sitemap.xml`. |
| F-1-38 | Restored the full visible mobile wordmark; the 390 px header now shows Bookmark Import Audit beside BIA. | `the 390px header visibly names Bookmark Import Audit`; local/final-live 390 px screenshots; live `/`. |
| F-1-39 | Kept the direct “Bookmark import checker” category label. | `.factory/copy-audit.md`; live `/`. |
| F-1-40 | Kept the real-data action “Audit my bookmark HTML file.” | first-screen test; live `/`. |
| F-1-41 | Kept “bookmark HTML file” consistently as the input name. | `.factory/copy-audit.md`; live `/`. |
| F-1-42 | Kept deterministic and cleaned-URL jargon out of visitor and CSV copy. | source scan; `.factory/copy-audit.md`. |
| F-1-43 | Kept the method heading about checking and preserving bookmarks. | `.factory/copy-audit.md`; live `/`. |
| F-1-44 | Kept “full folder path” as the hierarchy term. | `.factory/copy-audit.md`; `@claim:corrected-export`. |
| F-1-45 | Kept URL differences in visible http/https, www, tracking, and redirect-link language. | `@claim:audit-categories`; live `/`. |
| F-1-46 | Kept unsupported paid-section copy absent. | source scan; live `/`. |
| F-1-47 | Kept the canonical nouns audit, issue, bookmark app, bookmark HTML file, and full folder path. | `.factory/copy-audit.md`; live routes. |
| F-1-48 | Kept landing and README sentences within the audit rules and concrete cache/output wording. | `.factory/copy-audit.md`; README scan. |
| F-1-49 | Kept “Install update” as the update action. | browser suite; live root source. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept demo-to-real exit destructive only to demo storage, restoring a fresh sample on next demo entry. | `@claim:demo-exit-discard`; live `/demo`. |
| F-2-2 | Kept the external-style, metadata-complete HTTP 404 with no CSP console error. | `@claim:designed-404`; live `/does-not-exist`; axe suite. |
| F-2-3 | Kept 25 MiB in guidance and picker/drop rejection messages. | `@claim:file-size-limit`; `.factory/copy-audit.md`. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept the complete primary action in the 1440 × 900 first viewport. | `the complete primary action is visible at 1440 by 900`; live `/`. |
| F-3-2 | Kept every visible phone control at least 44 × 44 CSS px. | `every mobile interactive target is at least 44 by 44 CSS pixels`; live 390 px routes. |
| F-3-3 | Kept exact CSV row mapping and nonempty actions. | `@claim:csv-export`; live demo CSV export. |
| F-3-4 | Kept complete corrected-export comparisons. | `@claim:corrected-export`; live demo export. |
| F-3-5 | Kept delivery assertions against built config and emitted routes. | `@claim:delivery-config`; clean build. |
| F-3-6 | Kept privacy inventory as its own registered claim. | `@claim:privacy-inventory`; live demo. |
| F-3-7 | Kept the untested public Node-version wording removed. | README scan; clean-clone `npm ci`. |
| F-3-8 | Kept the output inventory for routes, offline files, manifest, worker, sitemap, icon, and host config. | `@claim:build-output`; clean build. |
| F-3-9 | Kept direct browser-export input guidance. | `.factory/copy-audit.md`; live `/`. |
| F-3-10 | Kept the observable separate corrected-download fact. | `@claim:corrected-export`; live `/`. |
| F-3-11 | Kept designed 404 behavior registered. | `@claim:designed-404`; live `/does-not-exist`. |
| F-3-12 | Kept the unnecessary browser pre-script promise absent. | README scan. |
| F-3-13 | Kept registry integrity enforcement for exactly one tag per claim. | `claim registry integrity`; 15/15 command run. |
| F-3-14 | Kept one picker/drop validator with equal recovery behavior. | `@claim:file-size-limit`; live upload UI. |
| F-3-15 | Kept the demo statement that names the saved audit. | `.factory/copy-audit.md`; live `/`. |
| F-3-16 | Kept reader-facing storage language as “this browser.” | README; live `/privacy`. |
| F-3-17 | Kept “anything after #” for URL text. | `.factory/copy-audit.md`; live demo. |
| F-3-18 | Kept http/https instead of protocol jargon. | `.factory/copy-audit.md`; live demo. |
| F-3-19 | Kept bookmark HTML file terminology across product copy. | `.factory/copy-audit.md`; live routes. |
| F-3-20 | Kept concrete scripts, styles, images, and icons in cache documentation. | README; `@claim:delivery-config`. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Kept demo free of the landing hero and immediately populated with file, gauges, categories, and both exports. | `one click opens a populated demo at the top of the viewport`; live `/?demo=1`. |
| F-4-2 | Kept generic importer behavior out of claims; the local Chrome 145 fixture has narrow, tested guidance. | `@claim:destination-profile`; live demo and `/terms`. |
| F-4-3 | Kept “anything after #” in landing, results, README, and CSV text. | source scan; `.factory/copy-audit.md`. |
| F-4-4 | Kept the data-specific privacy heading. | `.factory/copy-audit.md`; live `/`. |
| F-4-5 | Kept concrete Demo, Privacy, Terms, offline, and host output names in README. | README; `@claim:build-output`. |
| F-4-6 | Kept concrete browser cache nouns in README. | README; `@claim:delivery-config`. |
| F-4-7 | Kept Generic audit and tested Chrome 145 profile behavior, scope, and CSV action. | `@claim:destination-profile`; live `/?demo=1`. |

## Review 5 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Removed the mobile rule that hid the wordmark. At 390 px the BIA mark and full product name stay visible on a legible first header row; navigation reflows below. | `the 390px header visibly names Bookmark Import Audit`; local/final-live 390 px screenshots; live `/`. |

## Verification summary

- Final fresh clone: `/tmp/bookmark-polish5-final-clean.KYxtU5` at
  `4960a9262521bb14e245508f16b847c128bb9218`.
- All 15 exact `.factory/claims.json` commands passed, followed by lint,
  typecheck, build, and 36/36 Playwright tests.
- Final live suite: 36/36 Playwright tests across desktop and 390 px Chromium;
  its axe integration found zero serious or critical violations on root, demo,
  privacy, terms, offline fallback, and 404.
- Final cold live checks are recorded in `live-verification.json`: root and demo
  have one H1 and main, `lang=en`, no missing image alternatives or unnamed
  buttons, and zero console errors. Root, demo, privacy, and terms return 200;
  an arbitrary missing path returns 404.
- Final Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO
  100; FCP 1.0 s, LCP 1.2 s, TBT 170 ms, CLS 0.

No finding is deferred.
