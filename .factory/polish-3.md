# Polish 3 — cumulative adversarial review closure

Repair commit: `ed424f4`. Deployment:
`38389d9d-f75f-47b0-8f71-ee708742cd73` at
<https://bookmark-import-audit.sociobot.in>.

Evidence locations:

- clean clone: `/tmp/bookmark-polish3-clean.BOvLiz`
- local desktop: `/tmp/bookmark-polish-3/home-desktop.png`
- local mobile demo: `/tmp/bookmark-polish-3/demo-mobile.png`
- live desktop: `/tmp/bookmark-polish-3/live-home-desktop.png`
- live mobile demo: `/tmp/bookmark-polish-3/live-demo-mobile.png`
- live verifier reports: `/tmp/bookmark-polish-3/live-root/verify.json` and
  `/tmp/bookmark-polish-3/live-demo/verify.json`
- live Lighthouse JSON: `/tmp/bookmark-polish-3/lighthouse-live.json`

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept direct audience wording and moved the sample and real-file actions fully into the desktop first screen. | `the complete primary action is visible at 1440 by 900`; live desktop screenshot; live `/` primary action bottom y=700. |
| F-1-2 | Kept isolated `demo:bookmark-import-audit` storage, made `/?demo=1` the primary one-click path, and retained banner, reset, and exit controls. | `@claim:demo-isolation`, `@claim:demo-exit-discard`; live `/?demo=1`; live mobile screenshot. |
| F-1-3 | Reconciled 14 claims and added a registry-integrity test requiring one unique tag per claim. | `claim registry integrity`; all 14 commands passed from the clean clone. |
| F-1-4 | Retained browser-only processing wording and a full request-log assertion. | `@claim:local-processing`; live request inventory contained only the product origin. |
| F-1-5 | Retained the no-bookmark-request promise with unique `example.test` trap hosts. | `@claim:local-processing`; live bookmark request list was empty. |
| F-1-6 | Retained offline wording and verified reload, demo state, and CSV export without a network. | `@claim:offline-reload`; live cold offline check. |
| F-1-7 | Replaced source-mutation wording with “Downloads a separate corrected copy” and compared every input/output record. | `@claim:corrected-export`; live demo export. |
| F-1-8 | Kept an eight-bookmark sample that produces all four named issue categories. | `@claim:audit-categories`; live `/?demo=1`. |
| F-1-9 | Kept same-name folders in separate locations plus malformed-URL coverage. | `@claim:audit-categories`; `tests/unit/audit.test.ts`. |
| F-1-10 | Removed browser-export compatibility wording and standardized the input instruction to “bookmark HTML file.” | `.factory/copy-audit.md`; live root screenshot. |
| F-1-11 | Kept the exact 25 MiB boundary and now tests picker and drop paths plus recovery. | `@claim:file-size-limit`. |
| F-1-12 | Kept four named local checks and exact same-origin request coverage. | `@claim:audit-categories`, `@claim:local-processing`. |
| F-1-13 | Removed remaining “safe” output wording and explains the ignored tracking details and fragment. | normalization unit test; `.factory/copy-audit.md`; source scan. |
| F-1-14 | Uses http/https, www, and redirect-link wording and verifies no URL is followed. | `@claim:audit-categories`, `@claim:local-processing`. |
| F-1-15 | Uses “full folder path” and compares every nested path in the corrected output. | `@claim:corrected-export`. |
| F-1-16 | Compares the complete source/output URL multiset, including the tracked URL and fragment. | `@claim:corrected-export`. |
| F-1-17 | Asserts exactly two folder renames, one blank-title fallback, and unchanged unaffected records. | `@claim:corrected-export`. |
| F-1-18 | Parses the CSV, maps every displayed finding, and requires every suggested action. | `@claim:csv-export`. |
| F-1-19 | Real audits persist and can be forgotten; demo storage remains separate and is discarded on exit. | `@claim:real-audit-storage`, `@claim:demo-isolation`, `@claim:demo-exit-discard`. |
| F-1-20 | Broad clearing and obsolete license-storage promises remain absent. | source/copy scan; clean live storage context. |
| F-1-21 | Unsupported Plus worksheet remains removed. | source scan; live `/` screenshot. |
| F-1-22 | Unsupported free-tier entitlement wording remains removed. | `.factory/copy-audit.md`; live `/`. |
| F-1-23 | Unregistered price and purchase offer remain removed. | live link crawl; source scan. |
| F-1-24 | Dead checkout, merchant, and refund wording remain removed. | live link crawl; all discovered links return 200. |
| F-1-25 | Registered the full analytics/script/font/cookie inventory and added a strict resource-path allowlist. | `@claim:privacy-inventory`; live request inventory. |
| F-1-26 | Obsolete license network behavior remains absent. | source scan; live request inventory. |
| F-1-27 | Retained `engines.node >=20`; removed the public support-floor sentence that lacked a Node-20 matrix. | clean-clone `npm ci`, build, and test; `package.json`. |
| F-1-28 | Registered and inventories every required `dist/` artifact after a clean build. | `@claim:build-output`; clean clone. |
| F-1-29 | README lists executable commands without claiming a coverage matrix or pre-script behavior. | README copy audit; 30/30 full browser checks. |
| F-1-30 | Emits route-specific static documents without a navigation fallback. | `@claim:build-output`; live `/demo`, `/privacy`, `/terms`. |
| F-1-31 | Tests cache policy in `dist/staticwebapp.config.json`; live assets use one-year immutable caching. | `@claim:delivery-config`; live header check. |
| F-1-32 | Tests CSP, permissions, and anti-framing headers in the built config and live response. | `@claim:delivery-config`; live header check. |
| F-1-33 | Retained MIT metadata and a tagged license-content assertion. | `@claim:license-metadata`. |
| F-1-34 | Retained the product-styled static 404 and tests real status, structure, metadata, links, and CSP cleanliness. | `@claim:designed-404`; live `/does-not-exist` = 404. |
| F-1-35 | Route-specific static and runtime titles, descriptions, canonicals, OG/Twitter tags, icons, and preview remain present. | `@claim:build-output`; `real routes set titles…`; live route audit. |
| F-1-36 | History navigation still focuses the new h1 and updates the polite announcement on forward and back. | `real routes set titles, metadata, history focus, announcements, and working legal links`. |
| F-1-37 | Three method steps, common footer, factory credit, build id, and sitemap routes remain present. | live screenshots; route/link test. |
| F-1-38 | Wordmark identifies Bookmark Import Audit in both initial and rendered HTML. | live desktop screenshot; `index.html`. |
| F-1-39 | Hero label remains “Bookmark import checker.” | live desktop screenshot. |
| F-1-40 | Actions are “Try it with sample data” and “Audit my bookmark HTML file.” | live desktop and mobile screenshots. |
| F-1-41 | Input copy consistently says “bookmark HTML file.” | `.factory/copy-audit.md`; public-copy source scan. |
| F-1-42 | Removed remaining cleaned/deterministic jargon from visitor and generated-export copy. | `.factory/copy-audit.md`; source scan; normalization unit test. |
| F-1-43 | Method heading remains “How the audit checks and preserves bookmarks.” | live screenshots. |
| F-1-44 | Hierarchy terminology remains “full folder path.” | `.factory/copy-audit.md`; `@claim:corrected-export`. |
| F-1-45 | URL copy states visible http/https, www, tracking, fragment, and redirect-link differences. | live `/`; `@claim:audit-categories`. |
| F-1-46 | Unsupported paid section remains absent. | source scan; live `/`. |
| F-1-47 | Standardized audit, bookmark app, issue, full folder path, bookmark HTML file, and bookmark library. | `.factory/copy-audit.md`; source scan. |
| F-1-48 | Rewrote deployment caching in plain words; every audited sentence is at most 22 words. | `.factory/copy-audit.md`; README. |
| F-1-49 | Update action remains “Install update.” | `src/main.ts`; full browser regression suite. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Every demo-to-real transition deletes edited demo data before loading real storage. | `@claim:demo-exit-discard`; live reset/exit/restoration check. |
| F-2-2 | Unknown URLs retain HTTP 404 with external CSS, full metadata, common navigation/footer, and no CSP errors. | `@claim:designed-404`; live `/does-not-exist`; live axe. |
| F-2-3 | Guidance and both picker/drop errors use 25 MiB. | `@claim:file-size-limit`; source scan. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Reduced desktop hero padding and headline scale while preserving the console composition. | `the complete primary action is visible at 1440 by 900`; live action y=651–700; live desktop screenshot. |
| F-3-2 | Demo, privacy, footer, legal, header, and 404 links now have at least 44×44 targets. | `every mobile interactive target is at least 44 by 44 CSS pixels`; live demo controls both 44 px tall. |
| F-3-3 | CSV assertion now parses every row, maps all displayed findings, checks exact expected row count, and requires every action. | `@claim:csv-export`. |
| F-3-4 | Corrected export assertion now compares every URL, folder path, folder name, title, fallback, and unaffected record. | `@claim:corrected-export`. |
| F-3-5 | Delivery claim builds first and reads `dist/staticwebapp.config.json`, emitted demo document, and emitted 404. | `@claim:delivery-config`; clean clone. |
| F-3-6 | Added the exact privacy-inventory claim with request, path, script, style, font, and cookie assertions. | `@claim:privacy-inventory`; live inventory has zero external/bookmark requests. |
| F-3-7 | Removed the unlisted README Node-version sentence; package engine metadata remains. | README/source scan; clean-clone `npm ci`. |
| F-3-8 | Added a tagged output inventory for route, offline, manifest, service-worker, 404, and deployment files. | `@claim:build-output`. |
| F-3-9 | Replaced compatibility copy with “Choose the bookmark HTML file you exported from your browser.” | `.factory/copy-audit.md`; live root screenshot. |
| F-3-10 | Replaced source-file wording with the observable “Downloads a separate corrected copy.” | `@claim:corrected-export`; live root screenshot. |
| F-3-11 | Registered and tagged the designed HTTP 404 behavior. | `@claim:designed-404`; live route audit. |
| F-3-12 | Removed the unnecessary browser-pre-script sentence. | README source scan. |
| F-3-13 | Removed the unenforced completeness statement and added automated registry/tag integrity instead. | `claim registry integrity`; all registry commands passed. |
| F-3-14 | Picker and drop now share one validator, identical error feedback, and a tested recovery path. | `@claim:file-size-limit`. |
| F-3-15 | Changed vague copy to “Demo changes never replace your saved audit.” | `.factory/copy-audit.md`; live screenshots. |
| F-3-16 | Reader-facing storage copy says “stays in this browser”; IndexedDB remains only in the project map/demo technical docs. | README and live `/privacy`. |
| F-3-17 | Replaced “cleaned URL” with the exact tracking-details and `#`-fragment matching rule everywhere public. | `.factory/copy-audit.md`; source scan. |
| F-3-18 | Replaced “protocol change” with “http/https change.” | `.factory/copy-audit.md`; live `/`. |
| F-3-19 | Standardized the input as “bookmark HTML file”; “bookmark library” names only the collection. | `.factory/copy-audit.md`; public-copy source scan. |
| F-3-20 | Deployment copy now says browsers check pages for updates and cache versioned app files for one year. | README; `@claim:delivery-config`; live cache headers. |

## Final verification

- Every finding above is closed; none is deferred.
- Every one of the 14 commands in `.factory/claims.json` passed from the clean
  clone, followed by 14/14 unit tests and 30/30 full Playwright checks.
- Live verify-url checks on `/` and `/?demo=1` found one h1/main, `lang=en`, no
  missing alt text, no unnamed buttons, and no console errors.
- Live axe scans found zero serious or critical issues on root, demo, privacy,
  terms, and the designed 404.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
