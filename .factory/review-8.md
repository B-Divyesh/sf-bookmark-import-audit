# Adversarial first-read review 8 — Bookmark Import Audit

**Verdict: PASS**

Reviewed 2026-08-29 against commit `d2a203725342e0c3bd744543ca93ce9cc58dfc50` and the deployed site at <https://bookmark-import-audit.sociobot.in>. No product code was modified. There are zero blocking, major, minor, or untested-claim findings.

## Cold first read

Fresh Chromium contexts, with no existing cookies, storage, or service worker, opened `/` at 390 × 844 and 1440 × 900 without scrolling.

| First-screen question | Answer | Exact supporting text |
| --- | --- | --- |
| What does it do? | Checks a bookmark export before import for folder-name collisions and duplicate links. | “Check bookmarks before you import” |
| Who is it for? | People moving an old bookmark library to another bookmark app. | “For people moving an old bookmark library, find same-named folders and duplicate links before importing.” |
| What should I click first? | Try the completed sample, or audit a real bookmark HTML file. | “Try it with sample data”; “Audit my bookmark HTML file”; “See a completed audit.” |

Both actions, the result note, and all three plain facts were visible in both viewports. The mobile first screen uses the product’s navy enclosure, ivory graph paper, instrument labels, and orange control; it is not a generic SaaS layout.

## Findings

None. `F-8-*` IDs were not created because no failure was found.

## Copy audit

Counts use visible words; command blocks are excluded. No landing or README sentence exceeds 22 words. No banned marketing adjective, unexplained metaphor, inconsistent core term, context-free heading, or non-result-naming button was found.

### Landing page sentences and factual fragments

| Words | Exact copy | Result |
| ---: | --- | --- |
| 15 | For people moving an old bookmark library, find same-named folders and duplicate links before importing. | Pass |
| 4 | See a completed audit. | Pass |
| 7 | Demo changes never replace your saved audit. | Pass |
| 7 | Works offline after the first visit | Pass — `offline-reload` |
| 5 | Processes files in your browser | Pass — `local-processing` |
| 4 | No bookmark URL requests | Pass — `local-processing` |
| 14 | An inspection console traces bookmark folders from an input tray to an output tray | Pass — useful image alternative |
| 10 | Checks the full folder path, not only a folder name. | Pass |
| 10 | Choose the bookmark HTML file you exported from your browser. | Pass |
| 7 | Files up to 25 MiB are accepted. | Pass — `file-size-limit` |
| 7 | or drop the file onto this tray | Pass |
| 5 | Same name in different places | Pass |
| 10 | Same address after removing tracking details and anything after # | Pass |
| 5 | Possible redirect or http/https change | Pass |
| 5 | Missing titles and malformed URLs | Pass |
| 8 | Choose the bookmark HTML file from your browser. | Pass |
| 7 | Read issues with their full folder paths. | Pass |
| 7 | Download corrected HTML and a review CSV. | Pass |
| 9 | It does not upload or open your bookmark URLs. | Pass — `local-processing` |
| 13 | Your latest real audit is kept in this browser until you forget it. | Pass — `real-audit-storage` |
| 5 | Offline: the audit still works. | Pass — `offline-reload` |
| 5 | An app update is ready. | Pass — `pwa-asset-update` |
| 9 | Bookmark Import Audit checks bookmark HTML files before import. | Pass |

The non-sentence headings name their sections: “Bookmark import checker,” “Upload a bookmark HTML file,” “Four local checks,” “How the audit checks and preserves bookmarks,” and “How the app protects your bookmark data.” Buttons name their outcomes: “Try it with sample data,” “Audit my bookmark HTML file,” “Choose bookmark HTML file,” and “Install update.”

### README sentences and list statements

| Words | Exact copy | Result |
| ---: | --- | --- |
| 18 | Bookmark Import Audit checks a bookmark HTML file before you move the library to a new bookmark app. | Pass |
| 9 | It is for people moving an old bookmark library. | Pass |
| 8 | folders with the same name in different locations; | Pass — `audit-categories` |
| 14 | duplicate links with the same address after removing tracking details and anything after `#`; | Pass — `audit-categories` |
| 15 | links that differ by http, https, www, tracking details, or a known redirect link; and | Pass — `audit-categories` |
| 5 | missing titles and malformed URLs. | Pass — `audit-categories` |
| 11 | The corrected HTML keeps every bookmark URL and full folder path. | Pass — `corrected-export` |
| 12 | It changes only same-named folder labels from different paths and blank titles. | Pass — `corrected-export` |
| 9 | The review CSV gives each issue a suggested action. | Pass — `csv-export` |
| 9 | The optional **Importing into** selector starts with Generic audit. | Pass — `destination-profile` |
| 20 | The Chrome 145 profile uses a bundled, versioned folder-path fixture and changes only folder severity and the matching import checklist. | Pass — `destination-profile` |
| 6 | Files are processed in the browser. | Pass — `local-processing` |
| 5 | Bookmark URLs are not requested. | Pass — `local-processing` |
| 14 | The latest real audit stays in this browser until you choose **Forget this audit**. | Pass — `real-audit-storage` |
| 11 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | Pass — `privacy-inventory` |
| 8 | After the first visit, the app works offline. | Pass — `offline-reload` |
| 7 | Open `/?demo=1` for a separate sample audit. | Pass — `demo-isolation` |
| 8 | It never reads or writes ordinary saved audits. | Pass — `demo-isolation` |
| 6 | Starting for real discards demo edits. | Pass — `demo-exit-discard` |
| 9 | Run every command in `.factory/claims.json` from a clean checkout. | Pass — executed below |
| 16 | The build creates `dist/index.html`, pages for Demo, Privacy, and Terms, offline files, and the host configuration. | Pass — `build-output` |
| 15 | Every HTML page includes its title, description, canonical URL, sharing image, app icons, and manifest. | Pass — `build-output` |
| 7 | Deploy `dist/` as a static HTTPS app. | Pass — documentation instruction |
| 4 | The build includes `staticwebapp.config.json`. | Pass — `delivery-config` |
| 18 | Browsers check for a changed worker and show an update prompt when a changed app asset is ready. | Pass — `pwa-asset-update` |
| 13 | Hashed scripts and styles cache for one year; public images and icons revalidate. | Pass — `delivery-config` |
| 4 | Security headers are included. | Pass — `delivery-config` |
| 12 | Missing URLs show the product’s designed 404 page and return HTTP 404. | Pass — `designed-404` |
| 8 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass — project-map label |
| 7 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass — `demo-isolation` / `real-audit-storage` |
| 7 | `src/importProfiles.ts` — local destination rules and import guidance | Pass — `destination-profile` |
| 8 | `src/release.ts` — one build identifier shared by every page | Pass — `build-output` |
| 5 | `src/sw-template.js` — versioned offline cache worker | Pass — `offline-reload` / `pwa-asset-update` |
| 6 | `.factory/import-profiles.md` — destination fixture scope and provenance | Pass |
| 6 | `.factory/demo.md` — demo isolation and reset behavior | Pass |
| 6 | `.factory/claims.json` — visitor claims and their tests | Pass |
| 1 | MIT. | Pass — `license-metadata` |
| 2 | See [LICENSE](LICENSE). | Pass |

Headings (“What it checks,” “Privacy and offline use,” “Develop and verify,” “Deployment,” “Project map,” and “License”) are concrete. README controls are code commands, not vague buttons. The terminology remains consistent: **bookmark HTML file**, **bookmark library**, **audit**, **bookmark app**, **issue**, **full folder path**, **demo**, and **corrected copy**.

## Demo, privacy, and sandbox verification

- A fresh 390 px visit to `/?demo=1` showed the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, `sample-bookmark-library.html`, 8 bookmarks, 5 folders, 6 issues, all four issue categories, and both export actions in the first viewport.
- The demo used only `demo:bookmark-import-audit`. Reset restored the shipped sample. Start for real removed the stored demo audit; reopening demo returned the shipped sample. The ordinary `bookmark-import-audit` namespace stayed separate.
- The complete live demo load/reset/export request log contained only the site document, its JavaScript, CSS, and product image. It made no bookmark-URL, third-party, font, analytics, or cookie request.
- The direct deployed JavaScript, CSS, service worker, manifest, offline document, and 404 document hashes match the clean production build.

## Claims and quality gates

From fresh clone `/tmp/bookmark-review8-clean.lNHKIJ` after `npm ci`, every exact command in `.factory/claims.json` passed:

| Claim IDs | Result |
| --- | --- |
| `demo-isolation`, `demo-exit-discard`, `audit-categories`, `destination-profile` | Pass |
| `csv-export`, `corrected-export`, `local-processing`, `privacy-inventory` | Pass |
| `offline-reload`, `file-size-limit`, `pwa-asset-update`, `real-audit-storage` | Pass |
| `delivery-config`, `build-output`, `designed-404`, `license-metadata` | Pass |

Additional clean-clone gates passed: `npm test` (16/16), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` (40/40). The same deployed browser suite passed 40/40 using `PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in`.

All live claim-like landing and README statements map to a registry entry or are a directly verifiable instruction/label. No unlisted claim remains.

## Structure, routing, links, and accessibility

- `/`, `/demo`, `/privacy`, `/terms`, `/404`, `/offline.html`, all linked assets, manifest, robots file, and sitemap returned 200. An arbitrary missing URL returned the designed document with HTTP 404.
- Each route has the required title pattern, one H1, main landmark, description, canonical, Open Graph/Twitter data, favicon, 180 px Apple touch icon, and manifest. Back/forward route changes focus the H1 and announce the new title.
- The sitemap lists every public route, including `/404` and `/offline.html`. Header, skip link, legal footer, factory credit, and build identifier are consistent.
- Static headers include CSP, anti-framing, `nosniff`, Referrer-Policy, Permissions-Policy, and HSTS. The browser suite found no console errors and no serious or critical axe issue. It also passed keyboard, reduced-motion, 390 px target-size, and no-overflow checks.

## Earlier finding verification

Every earlier review, polish record, and handoff was read. The following are current live-and-code confirmations, not acceptance of prior “fixed” labels:

| Earlier IDs individually checked | Current result and present evidence |
| --- | --- |
| F-1-1, F-1-38, F-1-39, F-1-40 | Fixed: job-led first screen, visible full wordmark, direct product label, and result-naming actions pass in both cold viewports. |
| F-1-2, F-1-19, F-2-1, F-3-15, F-3-16 | Fixed: demo is separately stored, bannered, resettable, discard-on-exit, and clear about “this browser.” |
| F-1-3, F-3-13 | Fixed: all 16 registry entries have their unique tagged claim tests. |
| F-1-4, F-1-5, F-1-6, F-1-12, F-1-25, F-1-26, F-3-6 | Fixed: local processing, bookmark-host non-fetching, offline reload/export, privacy inventory, and no obsolete license request are tested. |
| F-1-7, F-1-15, F-1-16, F-1-17, F-1-18, F-3-3, F-3-4, F-3-10 | Fixed: corrected HTML and CSV tests compare every relevant output record and action. |
| F-1-8, F-1-9, F-1-10, F-1-11, F-1-13, F-1-14, F-3-9, F-3-14 | Fixed: current sample/category, input-boundary, plain URL, and recovery behavior are present and tested. |
| F-1-20, F-1-21, F-1-22, F-1-23, F-1-24, F-1-27, F-1-29, F-3-7, F-3-12 | Fixed: removed unsupported licensing, price, checkout, Node-floor, and test-harness promises remain absent. |
| F-1-28, F-1-30, F-1-31, F-1-32, F-1-33, F-1-34, F-1-35, F-1-36, F-1-37, F-2-2, F-3-5, F-3-8, F-3-11, F-6-1, F-6-2, F-7-2 | Fixed: build inventory, security/cache policy, MIT metadata, complete route metadata/shell, focus/history, 404, and sitemap checks pass live and in built output. |
| F-1-41, F-1-42, F-1-43, F-1-44, F-1-45, F-1-46, F-1-47, F-1-48, F-1-49, F-3-17, F-3-18, F-3-19, F-3-20, F-4-3, F-4-4, F-4-5, F-4-6, F-7-1 | Fixed: current public and empty-export copy consistently says “bookmark HTML file,” uses “anything after #” and http/https, names sections, stays concrete, and keeps action labels direct. |
| F-3-1, F-3-2, F-4-1, F-5-1 | Fixed: desktop first action and mobile targets remain visible; demo opens directly into the populated result; the mobile wordmark is intact. |
| F-4-2, F-4-7 | Fixed: generic behavior is explicitly non-predictive, and the optional Chrome 145 guidance is bundled, versioned, narrowly scoped, and tested. |

No earlier finding is unfixed, half-fixed, or regressed.

## Missed leverage

No omitted feature is evident from the brief. Corrected HTML and review CSV cover the implied export path. The local, fixture-tested destination selector gives the one useful destination-specific step without pretending to simulate every bookmark app. An AI feature, sync, or external URL lookup would weaken the product’s local-first, deterministic job and is not justified.

## What would make this perfect

No product change is required. Preserve the same evidence discipline on future releases: rerun the exact claim commands from a clean clone and the live browser suite after every deploy so the local-first, demo-isolation, and export guarantees remain true.
