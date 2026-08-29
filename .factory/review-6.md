# Adversarial first-read review 6 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 29 August 2026 against repository commit
`0d671083df68ba396574a48ea1f0049945868574` and the deployed site at
<https://bookmark-import-audit.sociobot.in>. No product code was changed. One
reopened blocking finding and two minor findings remain.

## Cold first read

Fresh Chromium contexts with no stored site data opened `/` at 390 × 844 and
1440 × 900. These notes were made at `scrollY = 0`, before scrolling.

| Question | Answer available on both first screens |
| --- | --- |
| What does this do? | It checks bookmarks for same-named folders and duplicate links before import. |
| Who is it for? | People moving an old bookmark library. |
| What should I click first? | **Try it with sample data** to see a completed audit; **Audit my bookmark HTML file** is the real-file path. |

The exact supporting copy is “Check bookmarks before you import”, “For people
moving an old bookmark library, find same-named folders and duplicate links
before importing”, “Try it with sample data”, and “See a completed audit. Demo
changes never replace your saved audit.” On mobile, the sample action occupies
y=519–567 and the real-file action y=579–627. On desktop, those actions occupy
y=652–700 and y=712–760. The three short facts end at y=765 on mobile and y=876
on desktop. The required first-read questions are answered without scrolling.

The visual identity remains distinct. The navy instrument casing, ivory graph
paper, orange signal lamp, condensed panel labels, serif reading text, offset
shadows, and original inspection-console image form a product-specific system.
It does not resemble a generic SaaS template.

## Findings

### F-1-35 — BLOCKING — Required route metadata remains incomplete on the offline page

This reopens the earlier metadata finding.

- **Exact location:** live `/offline.html` and `public/offline.html`.
- **Exact omission:** the document has `<title>Offline — Bookmark Import
  Audit</title>` and `lang="en"`, but it has no meta description, canonical
  link, Open Graph tags, Twitter card tags, favicon, apple-touch icon, or
  manifest link.
- **Why this fails:** the earlier metadata finding was marked fixed, but a
  shipped, directly reachable product page still lacks the required route
  metadata and product identity assets. A saved or shared offline URL has no
  canonical description or branded preview, and an installed-app fallback does
  not declare the app manifest or icons.
- **Concrete fix:** give `/offline.html` a plain description, canonical URL,
  favicon, 180 px apple-touch icon, manifest, and the same product-specific
  Open Graph/Twitter image metadata as the other routes. Add it to the metadata
  regression test so every emitted HTML page is inventoried.

### F-6-1 — Minor — The offline page drops the common site header and footer

- **Exact location/quote:** live `/offline.html` renders only “Bookmark audit
  offline”, “You are offline”, its explanation, and **Return to the audit**.
  There is no header, skip link, product-home wordmark, Privacy link, Terms
  link, factory credit, or build ID.
- **Why this matters:** the route is visually related to the product, but it
  does not use the common shell required on every page. A visitor who reaches
  the fallback cannot inspect the privacy or terms information from that page.
- **Concrete fix:** add the same skip link, product header, Privacy/Terms footer,
  factory credit, and current build ID used by the app routes. Keep the offline
  page script-free and locally styled. Extend the route-shell test to include
  `/offline.html`.

### F-6-2 — Minor — The 404 page reports a stale build identifier

- **Exact location/quote:** live app routes show `build 1.0.0-r5`; live `/404`
  and arbitrary missing URLs show `build 1.0.0-r4`. The same mismatch exists
  between `src/main.ts` and `public/404.html`.
- **Why this matters:** the shared footer gives conflicting release provenance.
  A visitor or maintainer cannot tell whether the error page belongs to the
  currently deployed build.
- **Concrete fix:** generate the build label for app and static fallback pages
  from one source. Assert that `/`, `/demo`, `/privacy`, `/terms`, `/404`, and
  an arbitrary HTTP 404 expose the same build ID.

## Copy audit

Counts use visible word tokens; hyphenated terms count as one word. Every
landing and README prose sentence is listed below. Headings, facts, and actions
are listed separately because the plain-words rules also apply to them. No copy
item exceeds 22 words, uses a banned marketing adjective, changes the core
terminology, uses a mood/metaphor heading, or needs a rewrite.

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

### Landing headings, facts, labels, and actions

| Words | Exact copy | Result |
| --: | --- | --- |
| 3 | Bookmark Import Audit | Pass |
| 1 | Audit | Pass |
| 1 | Demo | Pass |
| 1 | Privacy | Pass |
| 3 | Bookmark import checker | Pass |
| 5 | Check bookmarks before you import | Pass |
| 5 | Try it with sample data | Pass: names the sample result |
| 5 | Audit my bookmark HTML file | Pass: names the real-file result |
| 5 | Processes files in your browser | Pass; `local-processing` |
| 4 | No bookmark URL requests | Pass; `local-processing` |
| 5 | Downloads a separate corrected copy | Pass; `corrected-export` |
| 14 | An inspection console traces bookmark folders from an input tray to an output tray | Pass: useful image alternative |
| 5 | Upload a bookmark HTML file | Pass |
| 4 | Choose bookmark HTML file | Pass |
| 7 | or drop the file onto this tray | Pass |
| 3 | Four local checks | Pass; `audit-categories` |
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
| 1 | Review | Pass |
| 1 | Export | Pass |
| 1 | Privacy | Pass |
| 7 | How the app protects your bookmark data | Pass |
| 3 | Read privacy details | Pass |
| 2 | Install update | Pass |
| 1 | Terms | Pass |
| 4 | Built by Param Factory | Pass |
| 2 | build 1.0.0-r5 | Pass on app routes; F-6-2 covers the 404 mismatch |

Dynamic errors also pass: “That file is over 25 MiB.” (6), “Export a smaller
library before auditing.” (6), “This does not look like a bookmark HTML file.”
(9), and “Choose the file exported by your browser or bookmark app.” (10).

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
| 8 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass |
| 7 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass |
| 7 | `src/importProfiles.ts` — local destination rules and import guidance | Pass |
| 5 | `src/sw-template.js` — versioned offline cache worker | Pass |
| 6 | `.factory/import-profiles.md` — destination fixture scope and provenance | Pass |
| 6 | `.factory/demo.md` — demo isolation and reset behavior | Pass |
| 7 | `.factory/claims.json` — visitor claims and their tests | Pass |
| 4 | MIT. See LICENSE. | Pass |

README headings — “What it checks”, “Privacy and offline use”, “Develop and
verify”, “Deployment”, “Project map”, and “License” — name their sections. The
command block is executable syntax, not prose. The product consistently uses
**bookmark HTML file**, **bookmark library**, **audit**, **bookmark app**,
**issue**, **full folder path**, **demo**, and **corrected copy**.

## Demo and sandbox

The demo itself passes.

- One click on **Try it with sample data**, or direct entry through `/?demo=1`
  or `/demo`, opens the populated product rather than repeating the landing
  hero.
- At 390 × 844, the first post-click screen shows the persistent demo banner,
  `sample-bookmark-library.html`, 8 bookmarks, 5 folders, 6 issues, all four
  issue categories, and both export actions.
- **Reset demo** restores the shipped sample. **Start for real** discards demo
  edits. A saved real audit survives demo entry, reset, and exit.
- Demo state uses `demo:bookmark-import-audit`; real state uses
  `bookmark-import-audit`.
- The full demo flow makes only same-origin requests, requests no bookmark URL,
  loads no remote script or font, and creates no cookie. The offline reload and
  CSV export work after the first online visit.

## Claims

`.factory/claims.json` contains 15 entries with one unique tagged test each.
Every exact command passed from fresh clone
`/tmp/bookmark-review6-clean.rbdmVB`.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS — two Playwright projects |
| `demo-exit-discard` | PASS — two Playwright projects |
| `audit-categories` | PASS — two Playwright projects |
| `destination-profile` | PASS — two Playwright projects |
| `csv-export` | PASS — every displayed issue maps to an actionable row |
| `corrected-export` | PASS — every source record and permitted repair is compared |
| `local-processing` | PASS — same-origin request log and bookmark-host traps |
| `privacy-inventory` | PASS — requests, scripts, styles, fonts, and cookies inventoried |
| `offline-reload` | PASS — offline reload retains demo and CSV export |
| `file-size-limit` | PASS — picker/drop boundary plus recovery |
| `real-audit-storage` | PASS — refresh persistence and explicit removal |
| `delivery-config` | PASS — built cache and security policy inspected |
| `build-output` | PASS — emitted routes, offline files, manifest, icons, and host config |
| `designed-404` | PASS — arbitrary URL returns a structured, CSP-clean HTTP 404 |
| `license-metadata` | PASS — MIT license content |

Cross-checking the live landing, demo, Privacy, Terms, offline fallback, and
README found no claim-like sentence without a corresponding registry entry.
No claim is untested.

## Structure, routing, accessibility, and links

| URL | Status/title/structure | Metadata and shell |
| --- | --- | --- |
| `/` | 200; `Bookmark Import Audit — check bookmark imports`; one H1/main | Pass |
| `/demo` | 200; `Demo — Bookmark Import Audit`; one H1/main | Pass |
| `/privacy` | 200; `Privacy — Bookmark Import Audit`; one H1/main | Pass |
| `/terms` | 200; `Terms — Bookmark Import Audit`; one H1/main | Pass |
| `/404` | 200; `Page not found — Bookmark Import Audit`; one H1/main | Metadata passes; stale footer build is F-6-2 |
| arbitrary missing URL | 404 with the designed page | Metadata passes; stale footer build is F-6-2 |
| `/offline.html` | 200; `Offline — Bookmark Import Audit`; one H1/main | Fails metadata and common shell: F-1-35, F-6-1 |

- The live link crawl found no dead link. `/`, `/demo`, `/privacy`, `/terms`,
  and `/404` are in the sitemap.
- History navigation updates the URL and title, moves focus to the H1, and
  announces the route on forward and back.
- The full live Playwright suite passed 36/36 across desktop Chromium and the
  390 px project. Its axe integration found zero serious or critical violations
  on root, demo, Privacy, Terms, the offline fallback, and the 404 page.
- The supplied URL verifier passed root and `/?demo=1`: one H1/main, `lang=en`,
  no missing image alternative, no unnamed button, and no console error.
- Every tested mobile control is at least 44 × 44 CSS pixels; no 390 px route
  has horizontal overflow. Reduced motion, keyboard skip navigation, and focus
  styling pass.
- Live JavaScript and CSS byte-match the clean build. Initial JavaScript is
  27.35 kB uncompressed / 9.69 kB gzip, below the static-product limit.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. Each finding below
was checked against current code and live behavior; “PASS” does not rely on a
prior document's closure statement.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 | PASS — job, audience, primary sample action, and real-file action fit in both first screens. |
| F-1-2 | PASS — realistic demo, separate database, banner, reset, exit, and real-state isolation work. |
| F-1-3 | PASS — 15 registered claims each have one unique test tag. |
| F-1-4 | PASS — browser processing is registered and request-log tested. |
| F-1-5 | PASS — bookmark-host traps receive no request. |
| F-1-6 | PASS — offline reload and export work. |
| F-1-7 | PASS — corrected export preserves every source URL and path. |
| F-1-8 | PASS — the sample produces all four advertised issue categories. |
| F-1-9 | PASS — same-name folder and malformed-URL fixtures are present. |
| F-1-10 | PASS — unsupported browser-brand compatibility copy is absent. |
| F-1-11 | PASS — picker and drop enforce the exact 25 MiB boundary. |
| F-1-12 | PASS — four checks and request isolation are tested. |
| F-1-13 | PASS — subjective matching claims are absent; repeatable rules are unit-tested. |
| F-1-14 | PASS — visible URL differences are tested without fetching targets. |
| F-1-15 | PASS — full-folder-path wording and export comparison remain exact. |
| F-1-16 | PASS — all original URLs, including tracked and `#` variants, remain in the corrected copy. |
| F-1-17 | PASS — only same-name folder labels and blank titles change. |
| F-1-18 | PASS — CSV rows map to every displayed finding and include actions. |
| F-1-19 | PASS — real refresh/forget behavior and demo separation work. |
| F-1-20 | PASS — obsolete license storage and broad clearing copy are absent. |
| F-1-21 | PASS — the unsupported Plus worksheet is absent. |
| F-1-22 | PASS — unsupported free-tier entitlement copy is absent. |
| F-1-23 | PASS — no unregistered price or purchase offer is present. |
| F-1-24 | PASS — no dead checkout, merchant, refund, or revocation path is present. |
| F-1-25 | PASS — analytics, requests, scripts, fonts, resources, and cookies have a dedicated claim test. |
| F-1-26 | PASS — obsolete license network behavior is absent. |
| F-1-27 | PASS — untested public Node-version wording is absent; package metadata remains. |
| F-1-28 | PASS — `dist/index.html` and all documented outputs are inventoried. |
| F-1-29 | PASS — README gives runnable commands without an unsupported coverage promise. |
| F-1-30 | PASS — real static route documents load and unknown paths return HTTP 404. |
| F-1-31 | PASS — clean-build and live cache policies agree. |
| F-1-32 | PASS — CSP, permissions, anti-framing, nosniff, referrer, and HSTS policies are live. |
| F-1-33 | PASS — MIT license metadata and content are tested. |
| F-1-34 | PASS — arbitrary missing URLs return the designed, CSP-clean HTTP 404. |
| F-1-35 | **FAIL — reopened above:** `/offline.html` still lacks the required route metadata and identity assets. |
| F-1-36 | PASS — deep links, Back/Forward, H1 focus, and polite announcement work. |
| F-1-37 | PASS for its original landing/sitemap scope — method steps, footer provenance, and all five canonical routes are present. |
| F-1-38 | PASS — the full product wordmark is visible at 390 px and desktop widths. |
| F-1-39 | PASS — the category label is “Bookmark import checker”. |
| F-1-40 | PASS — the real-data action says “Audit my bookmark HTML file”. |
| F-1-41 | PASS — public input copy consistently says “bookmark HTML file”. |
| F-1-42 | PASS — deterministic and cleaned-URL jargon is absent from public copy. |
| F-1-43 | PASS — the method heading names the audit and preservation job. |
| F-1-44 | PASS — “full folder path” is the consistent hierarchy term. |
| F-1-45 | PASS — URL differences use visible http/https, www, tracking, and redirect-link language. |
| F-1-46 | PASS — the unsupported paid section remains absent. |
| F-1-47 | PASS — audit, issue, bookmark app, bookmark HTML file, and full folder path remain consistent. |
| F-1-48 | PASS — no landing or README sentence exceeds 22 words. |
| F-1-49 | PASS — the update action remains “Install update”. |
| F-2-1 | PASS — leaving demo deletes edits and the next entry restores the shipped sample. |
| F-2-2 | PASS — arbitrary paths return a metadata-complete, CSP-clean HTTP 404. |
| F-2-3 | PASS — guidance and both errors use 25 MiB. |
| F-3-1 | PASS — the primary action is entirely above the desktop fold. |
| F-3-2 | PASS — tested visible phone controls meet 44 × 44 CSS pixels. |
| F-3-3 | PASS — CSV assertions prove row-to-finding mapping and actions. |
| F-3-4 | PASS — corrected-export assertions compare every source record. |
| F-3-5 | PASS — delivery tests inspect built output. |
| F-3-6 | PASS — privacy inventory has a dedicated claim. |
| F-3-7 | PASS — unlisted public Node-version wording remains absent. |
| F-3-8 | PASS — build output has a registered inventory test. |
| F-3-9 | PASS — browser compatibility copy remains narrowed to an input instruction. |
| F-3-10 | PASS — the first-screen fact names a separate corrected download. |
| F-3-11 | PASS — designed-404 behavior is registered. |
| F-3-12 | PASS — the browser pre-script promise remains absent. |
| F-3-13 | PASS — registry integrity enforces exactly one tag per claim. |
| F-3-14 | PASS — oversized picker and drop paths report the same error and recover. |
| F-3-15 | PASS — demo isolation copy names the saved audit. |
| F-3-16 | PASS — reader copy says “browser”; IndexedDB stays in developer documentation. |
| F-3-17 | PASS — public copy says “anything after #”. |
| F-3-18 | PASS — public copy says http/https rather than “protocol”. |
| F-3-19 | PASS — “bookmark HTML file” consistently names the input. |
| F-3-20 | PASS — README names the cached scripts, styles, images, and icons. |
| F-4-1 | PASS — one click opens the populated result at the top of both viewports. |
| F-4-2 | PASS — generic importer claims are absent; Chrome guidance is fixture-scoped. |
| F-4-3 | PASS — unexplained “# fragment” terminology is absent. |
| F-4-4 | PASS — the privacy heading names bookmark data. |
| F-4-5 | PASS — README names concrete route and offline outputs. |
| F-4-6 | PASS — README names concrete cached file types. |
| F-4-7 | PASS — Generic audit and the tested Chrome 145 profile are present. |
| F-5-1 | PASS — the full product wordmark remains visible at 390 px. |

F-6-1 and F-6-2 are newly observed structural consistency defects rather than
failures covered by an earlier finding.

## Quality-gate evidence

- Fresh clone: `/tmp/bookmark-review6-clean.rbdmVB` at `0d671083`.
- `npm ci`: PASS, 142 packages and zero vulnerabilities.
- All 15 exact commands from `.factory/claims.json`: PASS.
- `npm test`: PASS, 15/15.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Complete deployed `npm run test:e2e`: PASS, 36/36 across desktop and mobile.
- Live root and demo URL verification: PASS, with no console errors.

## Missed leverage

No missing AI feature is justified. The core job is deterministic inspection of
a private local file, and sending bookmark data to a model would weaken the
privacy premise. The corrected HTML and review CSV provide the implied export
path. The Generic audit plus the locally fixture-tested Chrome 145 profile is an
honest first destination-specific workflow; the product does not claim broader
destination coverage. No decorative AI, provider key, or sync behavior exists.

## What would make this perfect

1. Complete the metadata and identity links on `/offline.html`, and cover that
   document in the metadata test.
2. Give the offline fallback the same navigable product shell and current build
   provenance as the other pages.
3. Replace the 404 page's stale `build 1.0.0-r4` with the current build ID and
   enforce one generated build value across every page.
4. Rerun the complete claim registry and deployed route suite. PASS requires
   zero remaining findings.
