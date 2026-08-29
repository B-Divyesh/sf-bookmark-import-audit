# Adversarial first-read review 5 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 2026-08-29 against repository commit `4b3f03ae08a3aa3d007da80cab8c687e6560291a` and the deployed site at <https://bookmark-import-audit.sociobot.in>. No product code was changed. One blocking regression remains.

## Cold first read

Fresh Chromium contexts (no stored site data) opened `/` at 390 × 844 and 1440 × 900.

| Question | Answer available before scrolling |
| --- | --- |
| What does this do? | It checks a bookmark HTML export for same-named folders and duplicate links before import. |
| Who is it for? | People moving an old bookmark library. |
| What should I click first? | **Try it with sample data** to see a completed audit, or **Audit my bookmark HTML file** for a real export. |

The exact first-screen copy is “Check bookmarks before you import”, “For people moving an old bookmark library, find same-named folders and duplicate links before importing”, “Try it with sample data”, and “See a completed audit. Demo changes never replace your saved audit.” On phone, the actions occupied y=486–594; on desktop, y=652–760. The visitor can answer the three required questions.

The visual system is distinct and appropriate: deep-navy instrument casing, ivory graph paper, a warm-orange signal color, serif reading face, condensed panel labels, and an original inspection-console illustration. It does not resemble a generic SaaS template.

## Finding

### F-5-1 — BLOCKING — Mobile hides the product-name wordmark (reopens F-1-38)

- **Location/quote:** live `/` at 390 px wide. The header’s only visible brand text is “BIA”; the full “Bookmark Import Audit” wordmark is absent. In code, [src/styles.css](/work/repo/src/styles.css:164) applies `.brand > span:last-child { display: none; }` at `max-width: 620px`.
- **Why this fails:** a cold phone visitor sees an unexplained acronym in the primary site identifier. This regresses review 1’s F-1-38 requirement that the wordmark name the product, and it does not meet the shared header requirement “wordmark → home.” The accessible label does not correct the visible first-read failure.
- **Concrete fix:** retain the visible text **Bookmark Import Audit** beside the mark at 390 px (reflow or reduce the navigation labels if necessary). Do not replace the product name with the unexplained acronym. Add a 390 px rendered-text assertion that the header brand visibly contains “Bookmark Import Audit”.

## Copy audit

Counts use visible word tokens. The tables list every prose sentence on the landing page and README; headings, fragments, and controls are separately checked below. No listed prose unit exceeds 22 words. No banned marketing adjective, mood heading, or non-result-naming button remains. The sole copy-system failure is the unexplained mobile “BIA” mark in F-5-1.

### Landing-page sentences

| Words | Exact copy | Result |
| --: | --- | --- |
| 15 | For people moving an old bookmark library, find same-named folders and duplicate links before importing. | Pass |
| 4 | See a completed audit. | Pass |
| 7 | Demo changes never replace your saved audit. | Pass |
| 10 | Checks the full folder path, not only a folder name. | Pass |
| 10 | Choose the bookmark HTML file you exported from your browser. | Pass |
| 7 | Files up to 25 MiB are accepted. | Pass |
| 8 | Choose the bookmark HTML file from your browser. | Pass |
| 7 | Read issues with their full folder paths. | Pass |
| 7 | Download corrected HTML and a review CSV. | Pass |
| 9 | It does not upload or open your bookmark URLs. | Pass |
| 13 | Your latest real audit is kept in this browser until you forget it. | Pass |
| 5 | Offline: the audit still works. | Pass |
| 5 | An app update is ready. | Pass |
| 9 | Bookmark Import Audit checks bookmark HTML files before import. | Pass |

### Landing headings, facts, and actions

| Copy | Words | Result |
| --- | --: | --- |
| Bookmark Import Audit | 3 | Pass on desktop; hidden on phone (F-5-1) |
| BIA | 1 | Unexplained phone-only acronym (F-5-1) |
| Check bookmarks before you import | 5 | Pass: direct job-led H1 |
| Bookmark import checker | 3 | Pass: product category label |
| Try it with sample data | 5 | Pass: result-naming sample action |
| Audit my bookmark HTML file | 5 | Pass: result-naming real-data action |
| Processes files in your browser | 5 | Pass: registered local-processing claim |
| No bookmark URL requests | 4 | Pass: registered local-processing claim |
| Downloads a separate corrected copy | 5 | Pass: registered corrected-export claim |
| Upload a bookmark HTML file | 5 | Pass |
| Four local checks | 3 | Pass |
| Folder paths | 2 | Pass |
| Same name in different places | 5 | Pass |
| Duplicate links | 2 | Pass |
| Same address after removing tracking details and anything after # | 10 | Pass |
| URL variants | 2 | Pass |
| Possible redirect or http/https change | 5 | Pass |
| Link quality | 2 | Pass |
| Missing titles and malformed URLs | 5 | Pass |
| How the audit checks and preserves bookmarks | 7 | Pass: contextual heading |
| How the app protects your bookmark data | 7 | Pass: contextual heading |
| Choose bookmark HTML file | 4 | Pass: result-naming control |
| Install update | 2 | Pass: result-naming control |

### README sentences and list items

| Words | Exact copy | Result |
| --: | --- | --- |
| 18 | Bookmark Import Audit checks a bookmark HTML file before you move the library to a new bookmark app. | Pass |
| 9 | It is for people moving an old bookmark library. | Pass |
| 8 | folders with the same name in different locations; | Pass |
| 14 | duplicate links with the same address after removing tracking details and anything after `#`; | Pass |
| 15 | links that differ by http, https, www, tracking details, or a known redirect link; and | Pass |
| 5 | missing titles and malformed URLs. | Pass |
| 11 | The corrected HTML keeps every bookmark URL and full folder path. | Pass |
| 12 | It changes only same-named folder labels from different paths and blank titles. | Pass |
| 9 | The review CSV gives each issue a suggested action. | Pass |
| 9 | The optional **Importing into** selector starts with Generic audit. | Pass |
| 20 | The Chrome 145 profile uses a bundled, versioned folder-path fixture and changes only folder severity and the matching import checklist. | Pass |
| 6 | Files are processed in the browser. | Pass |
| 5 | Bookmark URLs are not requested. | Pass |
| 14 | The latest real audit stays in this browser until you choose **Forget this audit**. | Pass |
| 11 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | Pass |
| 8 | After the first visit, the app works offline. | Pass |
| 7 | Open `/?demo=1` for a separate sample audit. | Pass |
| 8 | It never reads or writes ordinary saved audits. | Pass |
| 6 | Starting for real discards demo edits. | Pass |
| 9 | Run every command in `.factory/claims.json` from a clean checkout. | Pass |
| 15 | The build creates `dist/index.html`, pages for Demo, Privacy, and Terms, offline files, and the host configuration. | Pass |
| 7 | Deploy `dist/` as a static HTTPS app. | Pass |
| 4 | The build includes `staticwebapp.config.json`. | Pass |
| 17 | Browsers check pages for updates and cache uniquely named scripts, styles, images, and icons for one year. | Pass |
| 4 | Security headers are included. | Pass |
| 12 | Missing URLs show the product’s designed 404 page and return HTTP 404. | Pass |
| 8 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass: source-map label |
| 7 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass: source-map label |
| 7 | `src/importProfiles.ts` — local destination rules and import guidance | Pass: source-map label |
| 5 | `src/sw-template.js` — versioned offline cache worker | Pass: source-map label |
| 6 | `.factory/import-profiles.md` — destination fixture scope and provenance | Pass: source-map label |
| 6 | `.factory/demo.md` — demo isolation and reset behavior | Pass: source-map label |
| 7 | `.factory/claims.json` — visitor claims and their tests | Pass: source-map label |
| 4 | MIT. See LICENSE. | Pass |

README headings (“What it checks”, “Privacy and offline use”, “Develop and verify”, “Deployment”, “Project map”, and “License”) name their sections. Its command block is executable syntax, not reader-facing prose. Terminology remains consistent: **bookmark HTML file**, **bookmark library**, **audit**, **bookmark app**, **full folder path**, **demo**, and **corrected copy**.

## Demo and sandbox

The one-click path passes. Clicking **Try it with sample data**, or opening `/?demo=1` or `/demo`, immediately showed:

- “Demo — sample data, nothing is saved”, **Reset demo**, and **Start for real**;
- `sample-bookmark-library.html`, 8 bookmarks, 5 folders, 6 issues, all four finding categories, and both export buttons within the first result view; and
- only `demo:bookmark-import-audit` in IndexedDB in a fresh context.

The rendered demo made requests only to `https://bookmark-import-audit.sociobot.in`. The deployed test suite covers reset, demo-to-real discard, saved-real-audit isolation, request logging, offline reload, and local export. No weak-demo or demo-storage finding remains.

## Claims

`.factory/claims.json` lists 15 claims. From clean clone `/tmp/bookmark-review5-clean.fvBEwI` after `npm ci`, every exact command completed successfully. The final clean Playwright result was `{ "status": "passed", "failedTests": [] }`.

| Claim id | Result |
| --- | --- |
| demo-isolation | Pass |
| demo-exit-discard | Pass |
| audit-categories | Pass |
| destination-profile | Pass |
| csv-export | Pass |
| corrected-export | Pass |
| local-processing | Pass |
| privacy-inventory | Pass |
| offline-reload | Pass |
| file-size-limit | Pass |
| real-audit-storage | Pass |
| delivery-config | Pass |
| build-output | Pass |
| designed-404 | Pass |
| license-metadata | Pass |

`npm test` and the complete clean local Playwright suite also passed. The complete deployed Playwright suite passed with `PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in`. Cross-checking landing, demo, privacy, terms, and README copy found no unlisted claim-like statement.

## Structure, routes, and accessibility smoke checks

- `/`, `/demo`, `/privacy`, `/terms`, and `/404` returned 200 with route-specific title, description, canonical, OG/Twitter metadata, one H1, main, common header/footer, and a product asset preview. A random missing route returned the styled 404 with HTTP 404.
- The sitemap lists all five public routes. Live link crawl found every same-origin landing link returned 200. Back/forward route focus and the polite route announcement are covered by the deployed browser suite.
- Root and demo fresh-load request logs had only the product origin; root logged no console errors. The claims suite passes offline reload and no remote script/font/cookie inventory checks.
- The product has no missing obvious import/export, sync, or AI feature. It already provides the brief’s import, corrected HTML export, review CSV export, and an evidence-backed destination-profile selector. AI would not improve this deterministic local audit and is correctly absent.

## Earlier-finding verification

All earlier review and polish records were read. The following closure checks were repeated against both deployed behavior and current code/tests, rather than relying on prior “fixed” labels.

| Earlier ids | Current result |
| --- | --- |
| F-1-1 through F-1-37 | Confirmed fixed: first-screen actions, isolated demo, registry, privacy/offline/export behavior, limits, routing, security, legal pages, metadata, 404, sitemap, and focus behavior all pass the checks above. |
| **F-1-38** | **Regressed on the 390 px live header; reopened as F-5-1.** |
| F-1-39 through F-1-49 | Confirmed fixed: direct labels, input terminology, URL language, section names, no unsupported sales copy, copy limits, terminology, and update action remain correct. |
| F-2-1 through F-2-3 | Confirmed fixed: demo exit discards edits, missing paths return an external-style HTTP 404, and size guidance/error both say 25 MiB. |
| F-3-1 through F-3-20 | Confirmed fixed: desktop first-screen placement, mobile target sizes, export detail, build/delivery checks, privacy inventory, demo wording, URL language, terminology, and README cache/output copy remain correct. |
| F-4-1 through F-4-7 | Confirmed fixed: demo is populated first, external importer claims are constrained to a versioned local fixture, plain `#` wording is used, privacy/build/cache headings are concrete, and the tested destination selector is present. |

## What would make this perfect

Keep **Bookmark Import Audit** visible as the mobile header wordmark and add a 390 px regression test for it. After that change, rerun the claim commands and deployed browser suite; this review found no other remaining work.
