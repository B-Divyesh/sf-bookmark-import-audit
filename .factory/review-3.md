# Adversarial first-read review 3 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 2026-08-29 against commit `6bf88d61f013398de2e731a5807f7ee739d43f07`
and the live site at <https://bookmark-import-audit.sociobot.in>. Fresh Chromium
contexts used 390 × 844 and 1440 × 900 viewports. The deployed JavaScript and
CSS byte-match a clean local build. There are blocking and minor findings.

## Cold first read

These notes were recorded before scrolling.

| Viewport | What does it do? | For whom? | What should I click first? |
| --- | --- | --- | --- |
| 390 × 844 | Checks bookmarks for folder merges and duplicate links before import. | “People moving an old bookmark library.” | **Try it with sample data** is visible at y=515. |
| 1440 × 900 | Checks bookmarks for folder merges and duplicate links before import. | “People moving an old bookmark library.” | Cannot answer from the first screen. The first action starts below the viewport at y=910. |

The exact text that fails on desktop is the absence of any visible action after
“For people moving an old bookmark library, find folder merges and duplicate
links before importing.” The intended **Try it with sample data** action is 10 px
below the fold. This is blocking under the mandatory first-screen shape.

The mid-century inspection-console identity is distinctive. The ivory graph
paper, navy casing, condensed labels, orange signal, original console image,
and instrument-like result layout do not resemble a generic SaaS template.

## Blocking findings

### F-3-1 — BLOCKING — The desktop first screen has no visible action

**Reopens F-1-1.**

- **Location/quote:** live `/`, 1440 × 900; headline “Check bookmarks before you
  import” and audience sentence are visible, but **Try it with sample data**
  begins at y=910 and **Audit my bookmark file** at y=970.
- **Why this fails:** the visitor can identify the job and audience but cannot
  answer what to click first without scrolling. The task requires all three
  answers from the first screen on both viewports.
- **Concrete fix:** reduce the desktop headline/hero vertical footprint or move
  the actions directly under the audience sentence. Add a 1440 × 900 assertion
  that the complete primary action bounding box is within the viewport.

### F-3-2 — BLOCKING — Essential demo controls miss the 44 px mobile target

- **Location/quote:** live `/demo` at 390 px; **Reset demo** measures 90.7 ×
  24.8 px and **Start for real** measures 95.1 × 24.8 px. **Read privacy
  details** and footer Privacy/Terms links are also only 15–17 px high.
- **Why this fails:** Reset and Start for real are mandatory demo-sandbox
  controls. Their 25 px targets do not meet the attached 44 px touch baseline,
  so the phone demo is not fully tryable for visitors with limited precision.
- **Concrete fix:** give `.demo-banner` actions and standalone/footer links a
  44 px minimum hit area with inline-flex alignment and adequate separation.
  Add a 390 px test that measures every interactive target, treating the hidden
  file input through its large associated label.

### F-3-3 — BLOCKING — The CSV claim test does not prove its registered claim

**Reopens F-1-18.**

- **Location/quote:** claim `csv-export`: “an actionable row for each displayed
  issue.” The tagged test only checks the header and
  `filter(Boolean).length > 6`.
- **Why this fails:** any seven arbitrary rows pass. The test never relates CSV
  rows to displayed findings and never checks that each `suggested_action` is
  populated. The live sample currently shows 6 issue groups and exports 11
  non-empty action rows, but the registered test would not protect that result.
- **Concrete fix:** derive the displayed findings, parse the CSV, assert every
  finding is represented, and assert a non-empty suggested action on every data
  row.

### F-3-4 — BLOCKING — The corrected-export test checks only one source URL

**Reopens F-1-7, F-1-15, F-1-16, and F-1-17.**

- **Location/quote:** claim `corrected-export`: “keeps every bookmark URL and
  full folder path while changing only folder names that may merge and blank
  titles.” The test checks one URL, two renamed `Research` headings, and a total
  of eight links.
- **Why this fails:** eight changed URLs would still satisfy the count. The test
  does not compare every input URL/path/title with the output or prove that
  non-colliding folders and nonblank titles are unchanged.
- **Concrete fix:** parse input and output into records and assert an exact URL
  multiset, every full path, unchanged unaffected names/titles, the two expected
  folder renames, and the one expected blank-title fallback.

### F-3-5 — BLOCKING — The delivery claim test reads source, not build output

- **Location/quote:** claim `delivery-config`: “The build includes a static app
  configuration…” The tagged test reads
  `public/staticwebapp.config.json`; it never runs the build or reads
  `dist/staticwebapp.config.json`.
- **Why this fails:** the claim test could pass if the build stopped shipping
  the configuration. An ad hoc clean build produced the file, but the required
  tagged test does not prove its own registered claim.
- **Concrete fix:** make the claim command build first, then assert the policy
  in `dist/staticwebapp.config.json` and the emitted route/404 files.

### F-3-6 — BLOCKING — The analytics/privacy inventory is an unlisted claim

**Reopens F-1-25.**

- **Location/quote:** README: “There are no analytics, remote fonts,
  third-party scripts, or tracking cookies.” Privacy route: “It has no
  analytics, advertising scripts, remote fonts, or tracking cookies.”
- **Why this fails:** `local-processing` only registers processing without
  bookmark-URL or third-party-host requests. It does not register the broader
  analytics/script/font/cookie inventory, and its same-origin allowance would
  permit a first-party analytics request.
- **Concrete fix:** add one exact inventory claim and test all requests,
  cookies, loaded scripts, and fonts during the whole demo flow, including a
  deny-list/assertion for same-origin analytics endpoints; or narrow the copy to
  the existing registered promise.

### F-3-7 — BLOCKING — The Node version requirement remains unlisted

**Reopens F-1-27.**

- **Location/quote:** README: “Requires Node.js 20 or newer.”
- **Why this fails:** `package.json` declares `>=20`, but there is no
  `.factory/claims.json` entry or tagged test for the supported floor. The prior
  finding asked for both the constraint and a test; only the constraint exists.
- **Concrete fix:** add a `node-version` claim and a tagged clean-install/build
  job on Node 20, or remove the minimum-version sentence.

### F-3-8 — BLOCKING — The build-output promise remains unlisted

**Reopens F-1-28.**

- **Location/quote:** README: “The build creates `dist/index.html`, static route
  documents, and deployment files.”
- **Why this fails:** the clean build happens to produce them, but no claim entry
  names this output and no tagged test inventories it. The prior finding
  required a tagged clean-build assertion.
- **Concrete fix:** add a `build-output` claim whose command runs a clean build
  and checks `dist/index.html`, `/demo/index.html`, `/privacy/index.html`,
  `/terms/index.html`, `404.html`, `sw.js`, manifest, and deployment config.

### F-3-9 — BLOCKING — Browser export compatibility is still unlisted

**Reopens F-1-10.**

- **Location/quote:** landing upload guidance: “Browsers export bookmarks in
  this HTML format.”
- **Why this fails:** this broad compatibility promise has no claims entry and
  the sample is not evidence for multiple browser exporters.
- **Concrete fix:** replace it with the instruction “Choose the bookmark HTML
  file you exported from your browser.” Alternatively, name supported browsers,
  ship a fixture from each, and add a tagged compatibility test.

### F-3-10 — BLOCKING — The original-file promise is not in the registry

**Reopens F-1-7.**

- **Location/quote:** landing fact: “Original file stays unchanged.”
- **Why this fails:** `corrected-export` promises properties of the downloaded
  copy, not that the selected source file is never written. This separate
  visitor-facing promise has no exact entry or test.
- **Concrete fix:** rewrite it as the observable action “Downloads a separate
  corrected copy” and cover that in `corrected-export`, or add a separate tagged
  test that retains and compares the supplied file while exporting.

### F-3-11 — BLOCKING — The designed-404 promise is not registered

- **Location/quote:** README: “It also sets security headers and a designed 404
  response.”
- **Why this fails:** `delivery-config` registers cache and response-security
  policies only. The designed 404 is exercised by an untagged route test, so
  this part of the public sentence is absent from `claims.json`.
- **Concrete fix:** split the sentence. Register `designed-404` with the existing
  route test tagged to assert HTTP 404, title, one h1/main, metadata, common
  navigation/footer, home link, and no CSP violations.

### F-3-12 — BLOCKING — The browser-test build behavior is unlisted

- **Location/quote:** README: “Browser claim commands build first.”
- **Why this fails:** this is a behavior a contributor can rely on, but it has no
  claims entry. It is true because of `pretest:e2e`; truth outside the registry
  still violates the stated claims contract.
- **Concrete fix:** remove the sentence as unnecessary implementation detail, or
  register a test-harness claim that verifies the pre-script before documented
  commands are published.

### F-3-13 — BLOCKING — The README's claim-registry statement is false

- **Location/quote:** README: “Each visitor-facing claim is listed in
  `.factory/claims.json`.”
- **Why this fails:** F-3-6 through F-3-12 identify public promises that are not
  listed. A verifier is told the registry is complete when it is not.
- **Concrete fix:** reconcile every public claim and tagged test, then retain
  this sentence only if an automated copy-to-registry coverage check enforces
  it. Otherwise delete it.

## Minor findings

### F-3-14 — Oversized drag-and-drop files fail silently

- **Location/quote:** landing drop target: “or drop the file onto this tray” and
  “Files up to 25 MiB are accepted.”
- **Evidence:** dropping a 25 MiB + 1 byte file leaves `#audit-status` empty.
  Choosing the same oversized file through the picker shows the correct error.
- **Why this matters:** two advertised paths produce different feedback. A
  visitor can reasonably wait for an audit that never starts.
- **Concrete fix:** send picker and drop files through one size validator and
  show “That file is over 25 MiB. Export a smaller library before auditing.” for
  both. Extend `@claim:file-size-limit` with the drop path and recovery.

### F-3-15 — “Your work” is vague demo copy

- **Location/quote:** landing: “Sample data is never saved to your work.”
- **Why this matters:** the product otherwise calls the persistent object a
  “real audit” or “saved audit.” “Your work” introduces an undefined noun.
- **Concrete fix:** “Demo changes never replace your saved audit.”

### F-3-16 — “IndexedDB” is unexplained reader-facing jargon

- **Location/quote:** README: “The latest real audit is stored in IndexedDB
  until you choose Forget this audit.”
- **Why this matters:** the storage implementation does not help a bookmark user
  decide what is retained.
- **Concrete fix:** “The latest real audit stays in this browser until you
  choose **Forget this audit**.” Keep `IndexedDB` only in the project map.

### F-3-17 — “Cleaned URL” does not state the matching rule

- **Location/quote:** landing “Same cleaned URL”; README “duplicate links with
  the same cleaned URL.”
- **Why this matters:** “cleaned” could mean the address was modified. The user
  needs to know what differences the audit ignores.
- **Concrete fix:** “Same address after removing tracking details and the
  `#` fragment.” Use the same explanation in the README.

### F-3-18 — “Protocol change” is technical and less specific than the behavior

- **Location/quote:** landing: “Possible redirect or protocol change.”
- **Why this matters:** a first-time visitor may not map “protocol” to the
  visible `http`/`https` difference.
- **Concrete fix:** “Possible redirect or http/https change.”

### F-3-19 — The input changes names across the landing page and README

- **Location/quotes:** “browser bookmark export,” “old bookmark library,”
  “browser bookmark HTML file,” “bookmark file,” and “HTML export.”
- **Why this matters:** “library” is useful for the collection, but the four
  input-file names make one required file sound like several formats.
- **Concrete fix:** use **bookmark HTML file** for the input everywhere. Use
  **bookmark library** only for the collection inside it.

### F-3-20 — Deployment copy uses unexplained cache jargon

- **Location/quote:** README: “It revalidates documents and caches immutable
  assets for one year.”
- **Why this matters:** “revalidates” and “immutable assets” obscure the useful
  deployment behavior even for a reader following the setup instructions.
- **Concrete fix:** “Browsers check pages for updates and keep versioned app
  files cached for one year.”

## Complete copy audit

Counts use whitespace-separated words after removing Markdown markers. No item
exceeds 22 words and no banned marketing adjective appears.

### Landing page

| Words | Sentence, heading, label, or action | Result |
| ---: | --- | --- |
| 3 | Bookmark Import Audit | Pass |
| 1 | Audit | Pass |
| 1 | Demo | Pass |
| 1 | Privacy | Pass |
| 3 | Bookmark import checker | Pass |
| 5 | Check bookmarks before you import | Pass |
| 15 | For people moving an old bookmark library, find folder merges and duplicate links before importing. | Pass |
| 5 | Try it with sample data | F-3-1 layout only |
| 4 | Audit my bookmark file | F-3-19 |
| 4 | See a completed audit. | Pass |
| 8 | Sample data is never saved to your work. | F-3-15 |
| 5 | Processes files in your browser | Pass; `local-processing` |
| 4 | No bookmark URL requests | Pass; `local-processing` |
| 4 | Original file stays unchanged | F-3-10 |
| 10 | Checks the full folder path, not only a folder name. | Pass; `audit-categories` / `corrected-export` |
| 6 | Upload a browser bookmark HTML file | F-3-19 |
| 4 | Audit my bookmark file | F-3-19 |
| 7 | Browsers export bookmarks in this HTML format. | F-3-9 |
| 7 | Files up to 25 MiB are accepted. | Pass; F-3-14 affects drop errors |
| 3 | Choose bookmark HTML | F-3-19 |
| 7 | or drop the file onto this tray | F-3-14 |
| 5 | Try it with sample data | Pass |
| 3 | Four local checks | Pass |
| 2 | Folder paths | Pass |
| 5 | Same name in different places | Pass |
| 2 | Duplicate links | Pass |
| 3 | Same cleaned URL | F-3-17 |
| 2 | URL variants | Pass |
| 5 | Possible redirect or protocol change | F-3-18 |
| 2 | Link quality | Pass |
| 5 | Missing titles and malformed URLs | Pass |
| 4 | How the audit works | Pass |
| 7 | How the audit checks and preserves bookmarks | Pass |
| 1 | Upload | Pass |
| 7 | Choose the HTML export from your browser. | F-3-19 |
| 1 | Review | Pass |
| 7 | Read issues with their full folder paths. | Pass |
| 1 | Export | Pass |
| 7 | Download corrected HTML and a review CSV. | Pass |
| 1 | Privacy | Pass |
| 6 | What this app does not do | Pass |
| 9 | It does not upload or open your bookmark URLs. | Pass; `local-processing` |
| 13 | Your latest real audit is kept in this browser until you forget it. | Pass; `real-audit-storage` |
| 3 | Read privacy details | Pass |
| 8 | Bookmark Import Audit checks bookmark exports before import. | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 4 | Built by Param Factory | Pass |
| 2 | build 7b3d9a8 | Pass |

### README

| Words | Sentence, heading, list statement, or command | Result |
| ---: | --- | --- |
| 3 | Bookmark Import Audit | Pass |
| 17 | Bookmark Import Audit checks a browser bookmark export before you move it to a new bookmark app. | F-3-19 |
| 9 | It is for people moving an old bookmark library. | Pass |
| 3 | What it checks | Pass |
| 8 | folders with the same name in different locations; | Pass |
| 7 | duplicate links with the same cleaned URL; | F-3-17 |
| 15 | links that differ by http, https, www, tracking details, or a known redirect link; and | Pass |
| 5 | missing titles and malformed URLs. | Pass |
| 11 | The corrected HTML keeps every bookmark URL and full folder path. | F-3-4 |
| 11 | It changes only folder names that may merge and blank titles. | F-3-4 |
| 9 | The review CSV gives each issue a suggested action. | F-3-3 |
| 4 | Privacy and offline use | Pass |
| 6 | Files are processed in the browser. | Pass |
| 5 | Bookmark URLs are not requested. | Pass |
| 14 | The latest real audit is stored in IndexedDB until you choose Forget this audit. | F-3-16 |
| 11 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | F-3-6 |
| 8 | After the first visit, the app works offline. | Pass |
| 7 | Open `/demo` for a separate sample audit. | Pass |
| 8 | It never reads or writes ordinary saved audits. | Pass |
| 6 | Starting for real discards demo edits. | Pass |
| 3 | Develop and verify | Pass |
| 5 | Requires Node.js 20 or newer. | F-3-7 |
| 2 | `npm ci` | Pass |
| 2 | `npm test` | Pass |
| 3 | `npm run lint` | Pass |
| 3 | `npm run typecheck` | Pass |
| 3 | `npm run build` | Pass |
| 3 | `npm run test:e2e` | Pass |
| 7 | Each visitor-facing claim is listed in `.factory/claims.json`. | F-3-13 |
| 8 | Run every listed command from a clean checkout. | Pass |
| 5 | Browser claim commands build first. | F-3-12 |
| 10 | The build creates `dist/index.html`, static route documents, and deployment files. | F-3-8 |
| 1 | Deployment | Pass |
| 7 | Deploy `dist/` as a static HTTPS app. | Pass |
| 4 | The build includes `staticwebapp.config.json`. | F-3-5 |
| 10 | It revalidates documents and caches immutable assets for one year. | F-3-20 |
| 10 | It also sets security headers and a designed 404 response. | F-3-11 |
| 2 | Project map | Pass |
| 9 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass in developer file map |
| 8 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass in developer file map |
| 6 | `src/sw-template.js` — versioned offline cache worker | Pass in developer file map |
| 7 | `.factory/demo.md` — demo isolation and reset behavior | Pass in developer file map |
| 7 | `.factory/claims.json` — visitor claims and their tests | Pass in developer file map |
| 1 | License | Pass |
| 1 | MIT. | Pass |
| 2 | See `LICENSE`. | Pass |

## Demo and sandbox evidence

- One click on the mobile first-screen **Try it with sample data** opened `/demo`
  with the banner and a completed, realistic six-issue audit already visible.
- The sample contains eight bookmarks, nested same-name folders, duplicates,
  variants, a blank title, and a malformed URL.
- Replacing the sample with `edited-review-3.html` and choosing **Reset demo**
  restored `sample-bookmark-library.html`.
- A real audit named `real-review-3.html` survived demo entry, reset, exit, and
  reopening. Edited demo data did not return after Start for real.
- The full live flow made requests only to
  `https://bookmark-import-audit.sociobot.in`; no `*.example.test` bookmark URL
  was requested and the context had no cookies.
- After the service worker controlled `/demo`, an offline reload retained the
  banner, “6 issues found,” and CSV-capable app state.

The demo behavior itself passes. F-3-2 concerns touch accessibility, not storage
isolation.

## Registered claim results

Every command was run exactly as listed from clean clone
`/tmp/bookmark-review3-clean.mFZOjb` at the reviewed commit.

| Claim | Command result | Evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | 2 Playwright projects |
| `demo-exit-discard` | PASS | 2 Playwright projects |
| `audit-categories` | PASS | 2 Playwright projects |
| `csv-export` | PASS, inadequate assertion | F-3-3 |
| `corrected-export` | PASS, inadequate assertion | F-3-4 |
| `local-processing` | PASS | same-origin request log, no cookies |
| `offline-reload` | PASS | offline reload and export in 2 projects |
| `file-size-limit` | PASS for picker | 25 MiB accepted; +1 byte rejected; F-3-14 for drop |
| `real-audit-storage` | PASS | refresh and forget in 2 projects |
| `delivery-config` | PASS, wrong artifact inspected | F-3-5 |
| `license-metadata` | PASS | MIT text found |

Supporting clean-clone gates also pass: `npm test` 11/11, lint, typecheck,
build, and `npm run test:e2e` 24/24. Build output is 24.73 kB JavaScript
(8.93 kB gzip) and 18.82 kB CSS (5.23 kB gzip).

## Structure, routing, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An arbitrary missing URL
  returns 404 with the designed page.
- Each route has the required title pattern, one h1, one main, description,
  canonical, OG/Twitter image metadata, favicon, common header/footer, and a
  route-appropriate canonical URL after rendering.
- Forward and back navigation update the title and focus the route h1.
- All discovered links resolve: `/`, `/demo`, `/privacy`, and `/terms` return
  200. No dead link was found.
- The provided `verify-url.sh` passes `/` and `/demo` with zero console errors.
  Playwright Axe reports zero violations on `/`, `/demo`, `/privacy`, `/terms`,
  and the designed 404. F-3-2 is a manual target-size failure not reported by
  Axe.
- Security headers, same-origin CSP, anti-framing policy, immutable hashed-asset
  caching, reduced-motion CSS, alt text, and responsive no-overflow checks pass.

## Earlier finding verification

Every prior finding was checked in the current source and on the live artifact.

| Earlier ID | Current result and evidence |
| --- | --- |
| F-1-1 | **Reopened by F-3-1:** copy is fixed, but the desktop primary action is below the first screen. |
| F-1-2 | Fixed: live demo uses a separate database, reset works, real data survives, exit discards demo edits. |
| F-1-3 | Fixed as to registry existence and unique tags; F-3-6–F-3-13 identify current completeness/test-quality gaps. |
| F-1-4 | Fixed: local processing is registered and live requests remain same-origin. |
| F-1-5 | Fixed: no bookmark URL was requested in the complete live demo flow. |
| F-1-6 | Fixed: registered offline reload works live and locally. |
| F-1-7 | **Half-fixed; reopened by F-3-4 and F-3-10:** export works, but the exact preservation/original-file promises are not fully tested. |
| F-1-8 | Fixed: the sample visibly produces all four advertised categories. |
| F-1-9 | Fixed: folder collision and malformed URL fixtures remain present. |
| F-1-10 | **Half-fixed; reopened by F-3-9:** named-browser copy is gone, but broad browser-format compatibility remains unlisted. |
| F-1-11 | Fixed: exact 25 MiB picker boundary passes; F-3-14 is a separate drop-error gap. |
| F-1-12 | Fixed: four categories and request behavior have tagged tests. |
| F-1-13 | Fixed: subjective “safe deterministic” copy is absent; normalization has unit coverage. |
| F-1-14 | Fixed: visible variant language and no-request behavior are tested. |
| F-1-15 | **Half-fixed; reopened by F-3-4:** paths render correctly, but the claim test does not compare every path. |
| F-1-16 | **Half-fixed; reopened by F-3-4:** one tracked URL is checked, not every source URL. |
| F-1-17 | **Half-fixed; reopened by F-3-4:** expected renames appear, but unchanged records are not asserted. |
| F-1-18 | **Half-fixed; reopened by F-3-3:** CSV exports correctly live, but its claim assertion is insufficient. |
| F-1-19 | Fixed: real persistence, forget, and demo separation pass. |
| F-1-20 | Fixed: obsolete license storage and broad clearing promise are absent. |
| F-1-21 | Fixed: unsupported Plus worksheet is absent. |
| F-1-22 | Fixed: unsupported free-tier entitlement wording is absent. |
| F-1-23 | Fixed: price and purchase offer are absent. |
| F-1-24 | Fixed: dead checkout and merchant/refund claims are absent. |
| F-1-25 | **Half-fixed; reopened by F-3-6:** live inventory is clean, but the broader copy is not registered or fully protected. |
| F-1-26 | Fixed: no license request behavior remains. |
| F-1-27 | **Half-fixed; reopened by F-3-7:** engine metadata exists, but no tagged Node 20 test exists. |
| F-1-28 | **Half-fixed; reopened by F-3-8:** build output exists, but the promise remains unlisted and untagged. |
| F-1-29 | Fixed for the old coverage-list wording; F-3-12 covers the new unlisted harness promise. |
| F-1-30 | Fixed: real route files, deep links, and HTTP 404 behavior pass. |
| F-1-31 | Fixed live: hashed assets are immutable and documents revalidate; F-3-5 concerns the tagged test artifact. |
| F-1-32 | Fixed: live CSP, permissions, anti-framing, nosniff, and referrer headers are present. |
| F-1-33 | Fixed: MIT metadata and tagged test pass. |
| F-1-34 | Fixed: unknown live paths return the designed HTTP 404. |
| F-1-35 | Fixed: canonical, OG/Twitter, social image, and touch icon are present. |
| F-1-36 | Fixed: History API navigation, back/forward, h1 focus, and announcement code are present and pass live. |
| F-1-37 | Fixed: standard sections, footer provenance, build id, and sitemap routes are present. |
| F-1-38 | Fixed in rendered UI: the wordmark says Bookmark Import Audit. |
| F-1-39 | Fixed: hero label says Bookmark import checker. |
| F-1-40 | Fixed: actions name the sample and real-file results. |
| F-1-41 | Fixed: upload copy explains browser bookmark HTML. |
| F-1-42 | Fixed: “deterministic” is absent from visitor copy. |
| F-1-43 | Fixed: method heading names the section. |
| F-1-44 | Fixed: hierarchy uses “full folder path”; F-3-19 concerns input-file nouns. |
| F-1-45 | Fixed for implementation terminology; F-3-17 and F-3-18 are remaining plain-word issues. |
| F-1-46 | Fixed: unsupported paid section is absent. |
| F-1-47 | Fixed for core audit/destination/result nouns; F-3-19 records the remaining input noun drift. |
| F-1-48 | Fixed: the longest README sentence is 17 words. |
| F-1-49 | Fixed: the update button says Install update. |
| F-2-1 | Fixed live and in code: every demo-to-real transition deletes edited demo state. |
| F-2-2 | Fixed live and in code: arbitrary paths return a metadata-complete, CSP-clean designed 404 document. |
| F-2-3 | Fixed: guidance and error both use 25 MiB. |

## Missed leverage

No missing AI feature is justified. The job is deterministic comparison of a
private bookmark file; sending it to a model would weaken the local-first
premise. Corrected HTML and review CSV provide the obvious import/export step.
No decorative AI, provider key, direct Azure endpoint, or sync claim exists.

No additional product feature is raised in this round. The useful next work is
to make existing claims and mobile interactions exact, not add scope.

## What would make this perfect

Bring the primary action fully above the 1440 × 900 fold; make every mobile
target at least 44 px; fix the three weak claim tests; list or remove every
unregistered promise; return the same error for oversized picker and drop
inputs; and apply the proposed plain-word rewrites. Re-run this entire review
from fresh contexts. PASS requires zero findings and no untested claim.
