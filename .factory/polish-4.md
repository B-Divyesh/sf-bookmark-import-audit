# Polish 4 — cumulative finding closure

Repair commit: `c0d4212d0cf1607fc22f379b8a3c80fb2aa0b8c4`.
Deployment: `fc1cec9e-85d0-4547-b1a3-6b710d55477a` at
<https://bookmark-import-audit.sociobot.in>.

Committed visual evidence:

- `.factory/evidence/polish-4/live-demo-mobile.png`
- `.factory/evidence/polish-4/live-demo-desktop.png`
- `.factory/evidence/polish-4/live-profile-mobile.png`
- `.factory/evidence/polish-4/live-profile-desktop.png`
- `.factory/evidence/polish-4/live-verification.json`

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct first-screen job, audience, sample action, and real-file action fully in both cold viewports. | `the complete primary action is visible at 1440 by 900`; live mobile action y=486–534; desktop y=652–700. |
| F-1-2 | Kept separate real/demo databases, banner, reset, exit discard, and realistic eight-bookmark seed; demo now opens on the populated result. | `@claim:demo-isolation`; `@claim:demo-exit-discard`; live demo screenshots. |
| F-1-3 | Reconciled 15 claims with exactly one tagged test each. | `claim registry integrity`; all 15 commands passed from the clean clone. |
| F-1-4 | Kept browser-only processing wording and full request logging. | `@claim:local-processing`; live suite. |
| F-1-5 | Kept bookmark-host trap URLs and proved that none is requested. | `@claim:local-processing`; live suite. |
| F-1-6 | Kept the offline promise with controlled reload and CSV export. | `@claim:offline-reload`; live suite. |
| F-1-7 | Uses separate-download wording and compares every output record. | `@claim:corrected-export`. |
| F-1-8 | The shipped sample still covers all four named issue categories. | `@claim:audit-categories`; live demo. |
| F-1-9 | Same-named folders and the malformed URL remain explicit sample cases. | `@claim:audit-categories`; parser unit test. |
| F-1-10 | Browser compatibility claims remain absent; input copy asks for the exported bookmark HTML file. | copy audit; live root. |
| F-1-11 | Picker and drop accept exactly 25 MiB and reject one extra byte. | `@claim:file-size-limit`. |
| F-1-12 | The four checks and request isolation remain registered. | `@claim:audit-categories`; `@claim:local-processing`. |
| F-1-13 | Subjective safety/deterministic copy remains absent; matching rules are unit-tested. | `normalizes tracking parameters…` unit test; copy audit. |
| F-1-14 | URL differences use visible terms, and target URLs are never fetched. | `@claim:audit-categories`; `@claim:local-processing`. |
| F-1-15 | “Full folder path” remains consistent and every path is export-compared. | `@claim:corrected-export`. |
| F-1-16 | Every original URL, including tracking and `#` variants, remains in the corrected copy. | `@claim:corrected-export`. |
| F-1-17 | Only same-named folder labels from different paths and blank titles change. | `@claim:corrected-export`. |
| F-1-18 | Every displayed finding maps to an actionable CSV row. | `@claim:csv-export`. |
| F-1-19 | Real persistence/forget and demo isolation/discard remain covered. | `@claim:real-audit-storage`; demo claim tests. |
| F-1-20 | Broad clearing and obsolete license-storage wording remain absent. | source/copy scan; live privacy route. |
| F-1-21 | The unsupported Plus worksheet remains absent. | source scan; live root. |
| F-1-22 | Unsupported entitlement wording remains absent. | copy audit; live root. |
| F-1-23 | No unregistered price or purchase offer is rendered. | live link crawl; source scan. |
| F-1-24 | No dead checkout, merchant, or refund claim is rendered. | live 34/34 route/link suite. |
| F-1-25 | Analytics, scripts, fonts, resources, and cookies are inventoried separately. | `@claim:privacy-inventory`; live suite. |
| F-1-26 | No license request path is imported or rendered. | source scan; live request inventory. |
| F-1-27 | The untested public Node-version promise remains absent; package metadata retains `>=20`. | clean-clone `npm ci`; README scan. |
| F-1-28 | The build inventory checks the root page and every required route/offline/deployment artifact. | `@claim:build-output`. |
| F-1-29 | README lists runnable commands without an unproved coverage promise. | README; clean-clone full suite. |
| F-1-30 | Static route documents load directly and unknown paths return HTTP 404. | route test; live `/privacy`, `/terms`, and `/does-not-exist`. |
| F-1-31 | Built and live cache policies are asserted. | `@claim:delivery-config`; live response headers. |
| F-1-32 | CSP, permissions, anti-framing, nosniff, referrer, and HSTS headers are live. | `@claim:delivery-config`; live header check. |
| F-1-33 | MIT text and metadata remain present and tagged. | `@claim:license-metadata`. |
| F-1-34 | Unknown paths use the designed metadata-complete page with HTTP 404. | `@claim:designed-404`; live `/does-not-exist`. |
| F-1-35 | Added and referenced a decoded 180 × 180 Apple touch icon on app and static 404 pages. | `@claim:build-output`; live `identify` = 180x180. |
| F-1-36 | History navigation still updates URL/title, announces the route, and focuses its H1. | `real routes set titles, metadata, history focus…`; live suite. |
| F-1-37 | Kept the method/footer provenance and added canonical `/404` to the exact sitemap inventory. | `@claim:build-output`; live `/sitemap.xml`. |
| F-1-38 | Wordmark remains the product name. | live root screenshot. |
| F-1-39 | Hero label remains “Bookmark import checker”. | live root check. |
| F-1-40 | Real-file action remains “Audit my bookmark HTML file”. | first-screen test; live root. |
| F-1-41 | Input wording remains “bookmark HTML file”. | copy audit. |
| F-1-42 | Deterministic/cleaned-URL jargon remains absent from visitor and CSV copy. | source scan; copy audit. |
| F-1-43 | Method heading names the audit and preservation task. | live root; copy audit. |
| F-1-44 | Hierarchy terminology remains “full folder path”. | copy audit; export claim. |
| F-1-45 | URL differences use http/https, www, tracking details, and redirect-link wording. | audit-category claim; copy audit. |
| F-1-46 | Unsupported paid-section copy remains absent. | source scan; live root. |
| F-1-47 | Audit, issue, bookmark app, bookmark HTML file, and full folder path remain the canonical nouns. | `.factory/copy-audit.md`. |
| F-1-48 | Every audited sentence is at most 22 words; README names concrete build/cache outputs. | `.factory/copy-audit.md`; README. |
| F-1-49 | Update action remains “Install update”. | source scan; full browser suite. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Every demo-to-real transition still deletes demo edits and returns to the shipped seed next time. | `@claim:demo-exit-discard`; live suite. |
| F-2-2 | The 404 remains an external-style, metadata-complete, CSP-clean HTTP 404. | `@claim:designed-404`; live `/does-not-exist`; live axe. |
| F-2-3 | Guidance and errors consistently say 25 MiB. | `@claim:file-size-limit`; copy audit. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Landing actions remain entirely above the 1440 × 900 fold. | first-screen test; live primary action bottom y=700. |
| F-3-2 | Every visible mobile link, button, input label, and select is at least 44 px. | `every mobile interactive target…`; live suite. |
| F-3-3 | CSV rows still map to every displayed finding and include actions. | `@claim:csv-export`. |
| F-3-4 | Export still compares every URL, path, folder, title, fallback, and unaffected record. | `@claim:corrected-export`. |
| F-3-5 | Delivery checks read the built `dist` configuration and emitted documents. | `@claim:delivery-config`. |
| F-3-6 | Privacy inventory remains a dedicated registered claim. | `@claim:privacy-inventory`; live suite. |
| F-3-7 | Public Node-version wording remains removed. | README scan. |
| F-3-8 | Build output is registered and now also checks the sitemap, 180px icon, and offline CSS. | `@claim:build-output`. |
| F-3-9 | Input guidance remains the direct browser-export instruction. | copy audit; live root. |
| F-3-10 | First-screen fact promises a separate corrected download. | `@claim:corrected-export`. |
| F-3-11 | Designed 404 remains registered. | `@claim:designed-404`; live 404. |
| F-3-12 | The browser-pre-script promise remains absent. | README scan. |
| F-3-13 | Registry integrity enforces one tag for every claim. | `claim registry integrity`; 15/15 commands. |
| F-3-14 | Picker/drop use one validator and recover after rejection. | `@claim:file-size-limit`. |
| F-3-15 | Demo copy names the saved audit. | live root; copy audit. |
| F-3-16 | Reader copy says “browser”; IndexedDB stays in developer documentation. | live privacy; README. |
| F-3-17 | Public matching copy now says “anything after #”. | source scan; copy audit. |
| F-3-18 | Public variant copy uses http/https. | source scan; copy audit. |
| F-3-19 | The input remains “bookmark HTML file” throughout. | copy audit. |
| F-3-20 | README names scripts, styles, images, and icons instead of cache jargon. | README; delivery claim. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Demo mode removes the repeated landing hero and starts with file, 8 bookmarks, 6 issues, four categories, and both exports. | `one click opens a populated demo at the top…`; live mobile screenshot; mobile exports y=715–764/844; desktop y=675–723/900. |
| F-4-2 | Removed generic importer-behavior claims. Generic mode says to review same-named folders; Terms says the app does not simulate the bookmark app. | live demo/terms; copy audit; destination claim. |
| F-1-35 | Closed the reopened icon detail with a real 180 × 180 asset and `sizes="180x180"` metadata. | built dimension assertion; live image decode. |
| F-1-37 | Closed the reopened route inventory detail by listing `/404` and comparing the complete sitemap list. | `@claim:build-output`; live sitemap. |
| F-4-3 | Replaced “# fragment” with “anything after #” in landing, result, README, and CSV copy. | source scan; copy audit. |
| F-4-4 | Replaced the vague privacy heading with “How the app protects your bookmark data”. | live root; copy audit. |
| F-4-5 | README names the Demo, Privacy, Terms, offline, and host outputs. | README; `@claim:build-output`. |
| F-4-6 | README names scripts, styles, images, and icons in the one-year cache description. | README; `@claim:delivery-config`. |
| F-4-7 | Added Generic audit and Chrome 145 choices backed by a versioned local fixture; only its folder rule changes severity, checklist, and CSV action. | `@claim:destination-profile`; fixture unit test; live profile screenshots. |

## Final evidence

- Clean clone: `/tmp/bookmark-polish4-clean.Kvkpxb` at `c0d4212`.
- All 15 exact `.factory/claims.json` commands: PASS.
- Clean clone: 15/15 unit/config tests, lint, typecheck, build, and 34/34
  Playwright checks: PASS.
- Live: 34/34 Playwright checks across desktop and 390px projects: PASS.
- Live verify-url on `/` and `/?demo=1`: one H1/main, `lang=en`, labelled
  controls, image alternatives, and zero console errors.
- Live axe in the full browser suite: zero serious/critical findings on root,
  demo, privacy, terms, offline fallback, and 404.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Initial JS 27.35 kB uncompressed / 9.67 kB gzip; CSS 21.16 kB / 5.63 kB
  gzip; mobile hero 23.03 kB.

No finding is deferred.
