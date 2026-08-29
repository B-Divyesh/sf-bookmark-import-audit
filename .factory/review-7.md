# Adversarial first-read review 7 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 29 August 2026 against repository commit
`7a2252b7f3f37ef2b74ac8030f955aaca105748a` and the live site at
<https://bookmark-import-audit.sociobot.in>. No product code was changed. One
reopened blocking copy finding and one minor route-inventory finding remain.

## Findings

### F-1-41 / F-1-47 / F-3-19 (reopened; round-7 index F-7-1) — BLOCKING — An error again names the legacy format instead of the product's input

- **Exact quote/location:** live `/`, after selecting a recognized but empty
  bookmark file: “No bookmark folders or links were found. **Export bookmarks
  as Netscape HTML**, then try that file.” The same text is in
  `src/audit.ts:78`.
- **Why this fails:** “Netscape HTML” is unexplained format jargon. A first-time
  visitor knows the input everywhere else as a “bookmark HTML file,” so the
  recovery instruction appears to ask for a different format. This regresses
  review 1 findings F-1-41 and F-1-47 plus review 3 finding F-3-19. It is
  blocking under the requirement to reopen any regressed earlier finding with
  the same ID.
- **Concrete fix:** rewrite the second sentence as “Export your bookmarks as a
  bookmark HTML file, then choose that file.” Add an end-to-end empty-export
  test that asserts the plain recovery text.

### F-7-2 — Minor — The sitemap omits a canonical shipped route

- **Exact quote/location:** live and source `sitemap.xml` list `/`, `/demo`,
  `/privacy`, `/terms`, and `/404`, but omit `/offline.html`. The omitted page
  returns 200 and declares
  `<link rel="canonical" href="https://bookmark-import-audit.sociobot.in/offline.html">`.
- **Why this fails:** the site publishes the offline fallback as a canonical
  route but excludes it from the route inventory. A visitor or crawler using
  the sitemap cannot discover a shipped recovery page, and the build test
  currently locks in the incomplete five-route list.
- **Concrete fix:** add
  `https://bookmark-import-audit.sociobot.in/offline.html` to `sitemap.xml` and
  to the exact sitemap assertion in `tests/unit/staticwebapp-config.test.ts`.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900 with service
workers blocked. These notes were recorded at `scrollY = 0` before scrolling.

| Question | Answer from both first screens |
| --- | --- |
| What does it do? | It checks bookmarks for same-named folders and duplicate links before import. |
| Who is it for? | People moving an old bookmark library. |
| What should I click first? | **Try it with sample data** to see a completed audit; **Audit my bookmark HTML file** is the real-file path. |

The exact supporting copy is “Check bookmarks before you import,” “For people
moving an old bookmark library, find same-named folders and duplicate links
before importing,” “Try it with sample data,” and “See a completed audit. Demo
changes never replace your saved audit.” The sample action occupied y=519–567
on mobile and y=652–700 on desktop. All three short facts also fit in both
viewports. The first-read requirement passes.

The navy instrument casing, ivory graph paper, orange signal lamp, condensed
panel labels, serif reading text, offset shadows, and original physical-console
image remain product-specific. The page does not look like a generic SaaS
template.

## Complete copy audit

Counts use visible word tokens; punctuation and standalone separators are not
words. The tables include prose, headings, labels, actions, hidden status text,
and authored result/error states. Sample bookmark values are data, not authored
sentences. Nothing exceeds 22 words and no banned marketing adjective appears.
Only the error marked F-7-1/F-1-41 needs rewriting.

### Landing page — default and shared copy

| Words | Exact copy | Result |
| --: | --- | --- |
| 4 | Skip to page content | Pass |
| 3 | Bookmark Import Audit | Pass |
| 1 | Audit | Pass |
| 1 | Demo | Pass |
| 1 | Privacy | Pass |
| 3 | Bookmark import checker | Pass |
| 5 | Check bookmarks before you import | Pass |
| 15 | For people moving an old bookmark library, find same-named folders and duplicate links before importing. | Pass |
| 5 | Try it with sample data | Pass |
| 5 | Audit my bookmark HTML file | Pass |
| 4 | See a completed audit. | Pass |
| 7 | Demo changes never replace your saved audit. | Pass |
| 6 | Works offline after the first visit | Pass |
| 5 | Processes files in your browser | Pass |
| 4 | No bookmark URL requests | Pass |
| 14 | An inspection console traces bookmark folders from an input tray to an output tray | Pass |
| 10 | Checks the full folder path, not only a folder name. | Pass |
| 5 | Upload a bookmark HTML file | Pass |
| 5 | Audit my bookmark HTML file | Pass |
| 10 | Choose the bookmark HTML file you exported from your browser. | Pass |
| 7 | Files up to 25 MiB are accepted. | Pass |
| 4 | Choose bookmark HTML file | Pass |
| 7 | or drop the file onto this tray | Pass |
| 5 | Try it with sample data | Pass |
| 3 | Four local checks | Pass |
| 2 | Folder paths | Pass |
| 5 | Same name in different places | Pass |
| 2 | Duplicate links | Pass |
| 10 | Same address after removing tracking details and anything after # | Pass |
| 2 | URL variants | Pass |
| 5 | Possible redirect or http/https change | Pass |
| 2 | Link quality | Pass |
| 5 | Missing titles and malformed URLs | Pass |
| 4 | How the audit works | Pass |
| 7 | How the audit checks and preserves bookmarks | Pass |
| 1 | Upload | Pass |
| 8 | Choose the bookmark HTML file from your browser. | Pass |
| 1 | Review | Pass |
| 7 | Read issues with their full folder paths. | Pass |
| 1 | Export | Pass |
| 7 | Download corrected HTML and a review CSV. | Pass |
| 1 | Privacy | Pass |
| 7 | How the app protects your bookmark data | Pass |
| 9 | It does not upload or open your bookmark URLs. | Pass |
| 13 | Your latest real audit is kept in this browser until you forget it. | Pass |
| 3 | Read privacy details | Pass |
| 5 | Offline: the audit still works. | Pass |
| 5 | An app update is ready. | Pass |
| 2 | Install update | Pass |
| 9 | Bookmark Import Audit checks bookmark HTML files before import. | Pass |
| 1 | Terms | Pass |
| 4 | Built by Param Factory | Pass |
| 2 | build 1.0.0-r7 | Pass |

### Landing page — audit, demo, and error states

| Words | Exact copy | Result |
| --: | --- | --- |
| 6 | Demo — sample data, nothing is saved | Pass |
| 2 | Reset demo | Pass |
| 3 | Start for real | Pass |
| 3 | Completed sample audit | Pass |
| 6 | 6 issues found in this sample | Pass |
| 3 | sample-bookmark-library.html · checked locally | Pass |
| 2 | Audit complete | Pass |
| 3 | 6 issues found | Pass |
| 1 | Review | Pass |
| 1 | Bookmarks | Pass |
| 1 | Folders | Pass |
| 2 | Levels deep | Pass |
| 1 | Issues | Pass |
| 2 | Importing into | Pass |
| 2 | Generic audit | Pass |
| 8 | Generic audit does not predict another app’s behavior. | Pass |
| 2 | Chrome 145 | Pass |
| 5 | Local profile 145.0.7632.6 · checked 2026-08-29 | Pass |
| 2 | Same-named folders | Pass |
| 2 | Duplicate links | Pass |
| 2 | URL variants | Pass |
| 5 | Missing titles or malformed URLs | Pass |
| 3 | Export corrected HTML | Pass |
| 3 | Export review CSV | Pass |
| 2 | Detailed findings | Pass |
| 5 | Review same-named folders before import. | Pass |
| 9 | The corrected copy gives each one a distinct name. | Pass |
| 10 | These full folder paths stay separate in the corrected copy. | Pass |
| 2 | Review paths | Pass |
| 11 | The local Chrome 145 fixture keeps these full folder paths separate. | Pass |
| 4 | Confirm them after import. | Pass |
| 2 | Lower risk | Pass |
| 11 | Links are grouped after removing tracking details and anything after #. | Pass |
| 8 | Every original link stays in the corrected copy. | Pass |
| 2 | Review copies | Pass |
| 3 | Likely URL variants | Pass |
| 11 | These differ by http, https, www, or a known redirect link. | Pass |
| 3 | Verify them manually. | Pass |
| 2 | Verify target | Pass |
| 6 | Blank titles get a hostname fallback. | Pass |
| 6 | Malformed URLs remain visible for repair. | Pass |
| 2 | Title fallback | Pass |
| 2 | Repair URL | Pass |
| 2 | Corrected copy | Pass |
| 4 | Export a corrected copy | Pass |
| 4 | The download is separate. | Pass |
| 13 | It changes only same-named folder labels from different paths and fills blank titles. | Pass |
| 3 | Before you import | Pass |
| 9 | Confirm every same-named folder after importing the corrected copy. | Pass |
| 10 | Confirm both same-named folder paths after importing into Chrome 145. | Pass |
| 2 | Original folder | Pass |
| 2 | Exported folder | Pass |
| 3 | Forget this audit | Pass |
| 6 | Reading folder paths and checking links… | Pass |
| 6 | That file is over 25 MiB. | Pass |
| 6 | Export a smaller library before auditing. | Pass |
| 9 | This does not look like a bookmark HTML file. | Pass |
| 10 | Choose the file exported by your browser or bookmark app. | Pass |
| 7 | No bookmark folders or links were found. | Pass |
| 9 | Export bookmarks as Netscape HTML, then try that file. | **Fail — F-7-1/F-1-41; rewrite specified above.** |
| 8 | The bookmark HTML file could not be read. | Pass |
| 7 | Export it again and try once more. | Pass |

All controls use direct verbs or destination labels. “Reset demo,” “Start for
real,” “Export corrected HTML,” “Export review CSV,” “Forget this audit,” and
“Install update” name their result. Core terminology is otherwise consistent:
**bookmark HTML file**, **bookmark library**, **audit**, **bookmark app**,
**issue**, **full folder path**, **demo**, and **corrected copy**.

### README

| Words | Exact copy | Result |
| --: | --- | --- |
| 3 | Bookmark Import Audit | Pass |
| 18 | Bookmark Import Audit checks a bookmark HTML file before you move the library to a new bookmark app. | Pass |
| 9 | It is for people moving an old bookmark library. | Pass |
| 3 | What it checks | Pass |
| 8 | folders with the same name in different locations; | Pass |
| 14 | duplicate links with the same address after removing tracking details and anything after `#`; | Pass |
| 15 | links that differ by http, https, www, tracking details, or a known redirect link; and | Pass |
| 5 | missing titles and malformed URLs. | Pass |
| 11 | The corrected HTML keeps every bookmark URL and full folder path. | Pass |
| 12 | It changes only same-named folder labels from different paths and blank titles. | Pass |
| 9 | The review CSV gives each issue a suggested action. | Pass |
| 9 | The optional **Importing into** selector starts with Generic audit. | Pass |
| 20 | The Chrome 145 profile uses a bundled, versioned folder-path fixture and changes only folder severity and the matching import checklist. | Pass |
| 4 | Privacy and offline use | Pass |
| 6 | Files are processed in the browser. | Pass |
| 5 | Bookmark URLs are not requested. | Pass |
| 14 | The latest real audit stays in this browser until you choose **Forget this audit**. | Pass |
| 11 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | Pass |
| 8 | After the first visit, the app works offline. | Pass |
| 7 | Open `/?demo=1` for a separate sample audit. | Pass |
| 8 | It never reads or writes ordinary saved audits. | Pass |
| 6 | Starting for real discards demo edits. | Pass |
| 3 | Develop and verify | Pass |
| 9 | Run every command in `.factory/claims.json` from a clean checkout. | Pass |
| 16 | The build creates `dist/index.html`, pages for Demo, Privacy, and Terms, offline files, and the host configuration. | Pass |
| 15 | Every HTML page includes its title, description, canonical URL, sharing image, app icons, and manifest. | Pass |
| 1 | Deployment | Pass |
| 7 | Deploy `dist/` as a static HTTPS app. | Pass |
| 4 | The build includes `staticwebapp.config.json`. | Pass |
| 18 | Browsers check for a changed worker and show an update prompt when a changed app asset is ready. | Pass |
| 13 | Hashed scripts and styles cache for one year; public images and icons revalidate. | Pass |
| 4 | Security headers are included. | Pass |
| 12 | Missing URLs show the product’s designed 404 page and return HTTP 404. | Pass |
| 2 | Project map | Pass |
| 8 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass |
| 7 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass |
| 7 | `src/importProfiles.ts` — local destination rules and import guidance | Pass |
| 8 | `src/release.ts` — one build identifier shared by every page | Pass |
| 5 | `src/sw-template.js` — versioned offline cache worker | Pass |
| 6 | `.factory/import-profiles.md` — destination fixture scope and provenance | Pass |
| 6 | `.factory/demo.md` — demo isolation and reset behavior | Pass |
| 6 | `.factory/claims.json` — visitor claims and their tests | Pass |
| 1 | License | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

The README command block contains executable commands rather than sentences;
each command is valid and was run through the documented quality gates.

## Demo and sandbox behavior

- One click on **Try it with sample data** opened `/?demo=1` with no landing
  hero. At 390 × 844, the first post-click viewport showed the persistent demo
  banner, Reset/Start controls, `sample-bookmark-library.html`, 8 bookmarks, 5
  folders, 6 issues, all four categories, and both export buttons.
- Direct `/demo` in a fresh context created only
  `demo:bookmark-import-audit`. The registered isolation test also saved a
  distinct real audit, entered and reset demo mode, and confirmed the real audit
  returned untouched.
- **Reset demo** restored the shipped sample. **Start for real** discarded an
  edited demo, and the next demo entry restored the sample.
- The complete live demo/reset/export flow requested only same-origin app
  resources, did not request any sample bookmark host, loaded no remote font or
  script, and created no cookie.
- After the initial online visit, the live demo reloaded and exported its CSV
  while the browser context was offline.

The demo requirement passes.

## Claims

All 16 exact commands in `.factory/claims.json` passed from clean clone
`/tmp/bookmark-review7-clean.SVK7k3` after `npm ci`.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-exit-discard` | PASS |
| `audit-categories` | PASS |
| `destination-profile` | PASS |
| `csv-export` | PASS |
| `corrected-export` | PASS |
| `local-processing` | PASS |
| `privacy-inventory` | PASS |
| `offline-reload` | PASS |
| `file-size-limit` | PASS |
| `pwa-asset-update` | PASS |
| `real-audit-storage` | PASS |
| `delivery-config` | PASS |
| `build-output` | PASS |
| `designed-404` | PASS |
| `license-metadata` | PASS |

The live landing, demo, Privacy, Terms, offline page, and README were
cross-checked against the registry. No claim-like sentence is unlisted and no
claim remains untested. F-7-1 is recovery wording, not an unlisted capability
claim. F-7-2 is a structural inventory defect; the existing build-output claim
test explicitly expects the same incomplete sitemap list.

## Structure, routing, links, and accessibility

| URL | HTTP result | Title and document structure |
| --- | --- | --- |
| `/` | 200 | `Bookmark Import Audit — check bookmark imports`; one H1/main; complete metadata and shell |
| `/demo` | 200 | `Demo — Bookmark Import Audit`; one H1/main; complete metadata and shell |
| `/privacy` | 200 | `Privacy — Bookmark Import Audit`; one H1/main; complete metadata and shell |
| `/terms` | 200 | `Terms — Bookmark Import Audit`; one H1/main; complete metadata and shell |
| `/404` | 200 | `Page not found — Bookmark Import Audit`; one H1/main; complete metadata and shell |
| `/offline.html` | 200 | `Offline — Bookmark Import Audit`; one H1/main; complete metadata and shell |
| `/review-7-missing` | 404 | Designed not-found document with the same metadata and shell |

- Titles, descriptions, canonicals, Open Graph/Twitter image metadata, SVG
  favicon, 180 × 180 touch icon, manifest, headers, footers, legal links, and
  build `1.0.0-r7` are consistent.
- The link crawl found no dead link. Root, `/?demo=1`, `/demo`, `/privacy`, and
  `/terms` returned 200; robots, manifest, sitemap, icons, and preview image also
  returned 200.
- History navigation updates the route title, moves focus to the H1, and
  announces the route on Back and Forward.
- The deployed Playwright suite passed 38/38 in desktop and 390 px Chromium.
  Its axe checks found no serious or critical violation on root, demo, Privacy,
  Terms, offline, or 404. Mobile targets, keyboard skip navigation, reduced
  motion, no-overflow behavior, and console cleanliness passed.
- The factory URL verifier passed root, `/?demo=1`, and `/offline.html` with
  `lang=en`, one H1/main, labelled buttons, image alternatives, and no console
  errors.
- Hashed JavaScript is 27.36 kB raw / 9.70 kB gzip and has a one-year immutable
  cache policy. All 23 publicly served build artifacts byte-match the live
  deployment.

F-7-2 is the only structure failure. Routing itself is not broken.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. Each finding was
checked against current code/tests and the live deployment. “Confirmed fixed”
below is based on this round's checks, not a prior closure label.

### Review 1

| ID | Current result |
| --- | --- |
| F-1-1 | Confirmed fixed — job, audience, and both actions fit both first screens. |
| F-1-2 | Confirmed fixed — realistic demo uses separate storage with banner, reset, exit, and real-data isolation. |
| F-1-3 | Confirmed fixed — 16 registry entries have unique tagged tests. |
| F-1-4 | Confirmed fixed — browser-only processing is request-log tested. |
| F-1-5 | Confirmed fixed — no bookmark host is requested. |
| F-1-6 | Confirmed fixed — offline reload and CSV export pass. |
| F-1-7 | Confirmed fixed — corrected export preserves every source URL and path. |
| F-1-8 | Confirmed fixed — the sample produces all four advertised issue categories. |
| F-1-9 | Confirmed fixed — same-name folders, blank title, and malformed URL are tested. |
| F-1-10 | Confirmed fixed — unsupported browser-brand compatibility copy remains absent. |
| F-1-11 | Confirmed fixed — picker and drop enforce the exact 25 MiB boundary. |
| F-1-12 | Confirmed fixed — four checks and request isolation are registered. |
| F-1-13 | Confirmed fixed — subjective matching language is absent; rules are unit-tested. |
| F-1-14 | Confirmed fixed — visible URL differences are tested without fetching targets. |
| F-1-15 | Confirmed fixed — full folder paths are compared in corrected output. |
| F-1-16 | Confirmed fixed — tracked and anything-after-# URLs remain unchanged in output. |
| F-1-17 | Confirmed fixed — only documented folder labels and blank titles change. |
| F-1-18 | Confirmed fixed — every displayed issue maps to an actionable CSV row. |
| F-1-19 | Confirmed fixed — real refresh/forget and demo separation pass. |
| F-1-20 | Confirmed fixed — obsolete license storage and broad clearing promise are absent. |
| F-1-21 | Confirmed fixed — unsupported Plus worksheet is absent. |
| F-1-22 | Confirmed fixed — unsupported free-tier entitlement copy is absent. |
| F-1-23 | Confirmed fixed — no unregistered price or purchase offer appears. |
| F-1-24 | Confirmed fixed — dead checkout, merchant, refund, and revocation paths are absent. |
| F-1-25 | Confirmed fixed — requests, scripts, fonts, resources, and cookies have a dedicated test. |
| F-1-26 | Confirmed fixed — obsolete license requests are absent. |
| F-1-27 | Confirmed fixed — untested public Node-floor wording is absent. |
| F-1-28 | Confirmed fixed — documented build artifacts are inventoried. |
| F-1-29 | Confirmed fixed — README lists runnable commands without an unsupported coverage promise. |
| F-1-30 | Confirmed fixed — deep-link files load and unknown paths return 404. |
| F-1-31 | Confirmed fixed — built and live cache policies agree. |
| F-1-32 | Confirmed fixed — CSP, permissions, anti-framing, nosniff, referrer, and HSTS headers are live. |
| F-1-33 | Confirmed fixed — MIT license metadata and content are tested. |
| F-1-34 | Confirmed fixed — arbitrary paths return the designed, CSP-clean HTTP 404. |
| F-1-35 | Confirmed fixed — every emitted HTML page, including offline, has complete metadata and identity assets. |
| F-1-36 | Confirmed fixed — deep links, Back/Forward, H1 focus, and announcements work. |
| F-1-37 | Confirmed for the earlier five-route requirement; F-7-2 records the newly identified offline-route omission. |
| F-1-38 | Confirmed fixed — the full product wordmark is visible at 390 px. |
| F-1-39 | Confirmed fixed — the category label directly names the bookmark checker. |
| F-1-40 | Confirmed fixed — the real-data action names the bookmark HTML file audit. |
| F-1-41 | **Regressed — reopened as F-7-1:** the empty-export error again says “Netscape HTML.” |
| F-1-42 | Confirmed fixed — deterministic/cleaned-URL jargon is absent from current public matching copy. |
| F-1-43 | Confirmed fixed — the method heading names the audit and preservation task. |
| F-1-44 | Confirmed fixed — “full folder path” is the hierarchy term. |
| F-1-45 | Confirmed fixed — URL differences use visible http/https, www, tracking, and redirect-link language. |
| F-1-46 | Confirmed fixed — unsupported paid copy remains absent. |
| F-1-47 | **Regressed — reopened as F-7-1:** the input changes from “bookmark HTML file” to “Netscape HTML” in the empty-export error. |
| F-1-48 | Confirmed fixed — no landing or README unit exceeds 22 words. |
| F-1-49 | Confirmed fixed — the update action is “Install update.” |

### Reviews 2–6

| ID | Current result |
| --- | --- |
| F-2-1 | Confirmed fixed — leaving demo discards edits and restores the shipped sample next time. |
| F-2-2 | Confirmed fixed — arbitrary paths return a metadata-complete, CSP-clean HTTP 404. |
| F-2-3 | Confirmed fixed — guidance and both errors use 25 MiB. |
| F-3-1 | Confirmed fixed — the primary action is entirely above the desktop fold. |
| F-3-2 | Confirmed fixed — all tested visible phone controls meet 44 × 44 CSS pixels. |
| F-3-3 | Confirmed fixed — CSV assertions map displayed findings and require actions. |
| F-3-4 | Confirmed fixed — corrected-export assertions compare every source record. |
| F-3-5 | Confirmed fixed — delivery tests inspect built output. |
| F-3-6 | Confirmed fixed — privacy inventory has a dedicated registered claim. |
| F-3-7 | Confirmed fixed — unsupported public Node-floor wording remains absent. |
| F-3-8 | Confirmed fixed — build output has a registered inventory test. |
| F-3-9 | Confirmed fixed — browser compatibility wording remains narrowed to an input instruction. |
| F-3-10 | Confirmed fixed — the first-screen copy promises a separate corrected download. |
| F-3-11 | Confirmed fixed — designed 404 behavior is registered. |
| F-3-12 | Confirmed fixed — the browser pre-script promise remains absent. |
| F-3-13 | Confirmed fixed — registry integrity enforces one tag per claim. |
| F-3-14 | Confirmed fixed — oversized picker/drop paths report the same error and recover. |
| F-3-15 | Confirmed fixed — demo isolation copy names the saved audit. |
| F-3-16 | Confirmed fixed — reader storage language says “this browser.” |
| F-3-17 | Confirmed fixed — public matching copy says “anything after #.” |
| F-3-18 | Confirmed fixed — public copy says http/https rather than “protocol.” |
| F-3-19 | **Regressed — reopened as F-7-1:** the empty-export recovery path uses a second name for the input format. |
| F-3-20 | Confirmed fixed — README names cached scripts, styles, images, and icons. |
| F-4-1 | Confirmed fixed — one click opens the populated result at the top of both viewports. |
| F-4-2 | Confirmed fixed — generic importer claims are absent; Chrome 145 guidance is fixture-scoped. |
| F-4-3 | Confirmed fixed — unexplained “# fragment” wording is absent. |
| F-4-4 | Confirmed fixed — the privacy heading names bookmark data. |
| F-4-5 | Confirmed fixed — README names concrete route and offline outputs. |
| F-4-6 | Confirmed fixed — README names concrete cached file types. |
| F-4-7 | Confirmed fixed — Generic audit and tested Chrome 145 profile behavior are present. |
| F-5-1 | Confirmed fixed — the full product name remains visible at 390 px. |
| F-6-1 | Confirmed fixed — offline has the common skip link, header, navigation, legal footer, factory credit, and build. |
| F-6-2 | Confirmed fixed — app, offline, 404, and missing-route footers use build `1.0.0-r7`. |

## Quality-gate evidence

From the clean clone:

```text
npm ci             PASS — 142 packages, 0 vulnerabilities
16 exact claim commands
                    PASS — 16/16
npm test           PASS — 16/16
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — dist/ created
npm run test:e2e   PASS — 38/38 desktop and 390 px Chromium
```

The complete deployed Playwright suite also passed 38/38.

## Missed leverage

No missing AI feature is justified. The job is deterministic inspection of a
private local file, and sending bookmark data to a model would weaken the
local-first premise. Corrected HTML and review CSV provide the implied export
path. Generic audit plus the fixture-tested Chrome 145 profile provides an
honest destination-specific step. No decorative AI, embedded provider key, or
sync behavior was found.

## What would make this perfect

1. Replace “Netscape HTML” in the empty-export error with “bookmark HTML file”
   and add a browser regression test for that recovery path.
2. Add `/offline.html` to the sitemap and to the exact route-inventory test.

After those two changes, rerun the full review. PASS requires zero findings;
this round therefore remains **FAIL**.
