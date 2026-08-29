# Adversarial first-read review 4 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 29 August 2026 against commit
`b6526a52c111a1626ec385122fa3ef6a1fb5a3f5` and the live site at
<https://bookmark-import-audit.sociobot.in>. Four blocking findings and five
minor findings remain. No product code was changed.

## Cold first read

Fresh Chromium contexts opened the deployed root at 390 × 844 and 1440 × 900.
Both began at `scrollY = 0`, with service workers blocked for the cold read.

| Question | Answer from the first screen |
| --- | --- |
| What does it do? | It checks bookmarks for folder merges and duplicate links before import. |
| Who is it for? | People moving an old bookmark library. |
| What should I click first? | **Try it with sample data** to see a completed audit, or **Audit my bookmark HTML file** for my own file. |

The exact text that supplied those answers was “Check bookmarks before you
import”, “For people moving an old bookmark library, find folder merges and
duplicate links before importing”, “Try it with sample data”, and “See a
completed audit.” Both actions and all three short facts were inside both
viewports. This part passes.

The visual identity also passes. The navy instrument casing, ivory graph paper,
orange signal lamp, condensed labels, serif reading text, physical-console
image, rules, and offset shadows are specific to this product. It is not a
generic centred SaaS hero or three-card template.

## Findings

### F-4-1 — BLOCKING — The one-click demo opens above the populated product

- **Location/quote:** click the first-screen “Try it with sample data” link at
  390 × 844 or 1440 × 900. The next viewport repeats “Check bookmarks before
  you import” and even repeats “Try it with sample data”.
- **Evidence:** after the click, `scrollY` remained 0. On mobile, “6 issues
  found” began at y=2032, 1,188 px below the 844 px viewport. On desktop it
  began at y=1907, 1,007 px below the 900 px viewport. The sample file name was
  lower still. The banner was visible, but no sample count, finding, folder
  path, URL, or export action was visible.
- **Why this fails:** the first post-click screen still looks like the landing
  page, not a product already being used with realistic data. A 30-second phone
  visitor can reasonably think the click did nothing except add a banner. This
  is a weak demo under the stated demo contract.
- **Concrete fix:** in demo mode, put a compact populated result first, directly
  below the banner. Show `sample-bookmark-library.html`, 8 bookmarks, 6 issues,
  the four finding categories, and the export actions in or immediately after
  the first viewport. Remove the redundant demo CTA from demo mode. Add a
  390 × 844 test that asserts the sample file name or issue summary intersects
  the viewport after one click; `toBeVisible()` alone is insufficient because
  it accepts content thousands of pixels below the fold.

### F-4-2 — BLOCKING — Importer-behaviour claims are unlisted and untested

- **Location/quotes:** demo result, “Some bookmark apps combine same-named
  folders.” Terms, “Browser and bookmark-app import behavior varies.”
- **Evidence:** `.factory/claims.json` has a test proving that the product flags
  same-named folders. It has no named bookmark-app fixture or test proving how
  another app imports them. None of the 14 entries covers the broader Terms
  statement either.
- **Why this fails:** visitors may rely on these statements when deciding
  whether an import is destructive. The sandbox proves the audit output, not
  the external apps' behavior. This is an unlisted claim.
- **Concrete fix:** remove the external claim and write “Review same-named
  folders before import.” Change the Terms sentence to “This app does not
  simulate your bookmark app. Review the corrected file before importing.” If
  importer behavior is retained, add one registry entry and a versioned export
  fixture for every named app.

### F-1-35 — BLOCKING — The prior Apple touch icon finding is only half-fixed

- **Location/quote:** live `link[rel="apple-touch-icon"]` on every route and
  `index.html` point to `/icons/icon-192.png`; that file is 192 × 192 pixels.
- **History:** review 1 required “a 180 px apple-touch icon.” The SVG favicon,
  canonical, OG/Twitter metadata, and 1200 × 630 preview are fixed, but the
  required icon size is not.
- **Why this fails:** this round requires every earlier finding to be confirmed
  in both the live site and code. A differently sized asset is not closure.
- **Concrete fix:** ship a product-specific 180 × 180 icon, reference it with
  `rel="apple-touch-icon" sizes="180x180"` in the app and static 404 documents,
  and add a build test that decodes and checks its dimensions.

### F-1-37 — BLOCKING — The prior sitemap finding is still half-fixed

- **Location/quote:** `public/sitemap.xml` and the live sitemap list `/`,
  `/demo`, `/privacy`, and `/terms`, but not the real `/404` route. Direct
  `/404` returns 200 with the designed not-found page and declares
  `https://bookmark-import-audit.sociobot.in/404` as canonical.
- **History:** review 1 explicitly found that the sitemap omitted “`/demo` and
  the future 404 route.” The three-step explanation, footer provenance, and
  `/demo` entry are fixed; `/404` remains absent.
- **Why this fails:** the current site-structure contract says the sitemap lists
  every route, and the earlier finding named this route. Marking the whole item
  fixed was inaccurate.
- **Concrete fix:** either list the canonical `/404` route as the contract
  requires, or remove `/404` as a 200/canonical public route and document that
  only unknown URLs serve the non-indexable HTTP 404 response. Add a test that
  compares the intended route inventory with the sitemap.

### F-4-3 — Minor — “# fragment” is unexplained URL jargon

- **Location/quotes:** landing check, “Same address after removing tracking
  details and the # fragment”; demo result, “Links are grouped after removing
  tracking details and the # fragment”; README duplicate-link bullet with the
  same term.
- **Why this matters:** a person moving bookmarks need not know that the part of
  a URL after `#` is called a fragment.
- **Concrete rewrite:** “Same address after removing tracking details and
  anything after #.” Use the equivalent complete sentence in the result and
  README.

### F-4-4 — Minor — The privacy heading does not name the data topic

- **Location/quote:** landing and demo H2, “What this app does not do”.
- **Why this matters:** heard out of context in a heading list, it could refer to
  pricing, compatibility, repair scope, or privacy.
- **Concrete rewrite:** “How the app protects your bookmark data”.

### F-4-5 — Minor — The README build output uses vague container terms

- **Location/quote:** README, “The build creates `dist/index.html`, route
  documents, offline files, and deployment configuration.”
- **Why this matters:** “route documents” and “deployment configuration” do not
  tell a maintainer which outputs to verify.
- **Concrete rewrite:** “The build creates `dist/index.html`, pages for Demo,
  Privacy, and Terms, offline files, and the host configuration.”

### F-4-6 — Minor — “Versioned app files” hides what the browser caches

- **Location/quote:** README, “Browsers check pages for updates and keep
  versioned app files cached for one year.”
- **Why this matters:** “versioned app files” is implementation shorthand, not
  a concrete inventory.
- **Concrete rewrite:** “Browsers check pages for updates and cache uniquely
  named scripts, styles, images, and icons for one year.”

### F-4-7 — Minor — The audit cannot answer for the destination app

- **Location/quote:** first-screen audience sentence says the product is for
  people moving a library; results only say “Some bookmark apps”.
- **Why this matters:** after seeing a possible folder merge, a normal visitor's
  next question is whether their chosen destination actually has that behavior.
  The current generic warning cannot answer it.
- **Concrete feature:** add an optional “Importing into” selector backed by
  local, versioned behavior profiles and fixtures. Keep “Generic audit” as the
  default. Adjust severity and the export checklist only where a tested target
  rule applies. This does not need AI; a model would make deterministic import
  compatibility less trustworthy. Do not add sync because it would conflict
  with the local/offline scope.

## Complete copy audit

Counts use visible word tokens; standalone typographic separators are not
words. Headings, labels, actions, facts, image alternatives, and dynamic result
sentences are included because the plain-words rules apply to them. No unit
exceeds 22 words and no banned marketing adjective appears. Flags point to
findings above.

### Default landing page

| Location | Words | Exact copy | Flag |
| --- | --: | --- | --- |
| Skip link | 3 | Skip to audit | — |
| Mobile mark | 1 | BIA | — |
| Wordmark | 3 | Bookmark Import Audit | — |
| Header link | 1 | Audit | — |
| Header link | 1 | Demo | — |
| Header link | 1 | Privacy | — |
| Hero label | 3 | Bookmark import checker | — |
| H1 | 5 | Check bookmarks before you import | — |
| Hero sentence | 15 | For people moving an old bookmark library, find folder merges and duplicate links before importing. | — |
| Primary action | 5 | Try it with sample data | — |
| Secondary action | 5 | Audit my bookmark HTML file | — |
| Action note | 4 | See a completed audit. | — |
| Action note | 7 | Demo changes never replace your saved audit. | — |
| Fact | 5 | Processes files in your browser | — |
| Fact | 4 | No bookmark URL requests | — |
| Fact | 5 | Downloads a separate corrected copy | — |
| Image alt | 14 | An inspection console traces bookmark folders from an input tray to an output tray | — |
| Image caption | 10 | Checks the full folder path, not only a folder name. | — |
| Upload label | 5 | Upload a bookmark HTML file | — |
| Upload H2 | 5 | Audit my bookmark HTML file | — |
| Upload sentence | 10 | Choose the bookmark HTML file you exported from your browser. | — |
| Upload sentence | 7 | Files up to 25 MiB are accepted. | — |
| File action | 4 | Choose bookmark HTML file | — |
| Drop instruction | 7 | or drop the file onto this tray | — |
| Sample action | 5 | Try it with sample data | — |
| Checks H2 | 3 | Four local checks | — |
| Check label | 2 | Folder paths | — |
| Check detail | 5 | Same name in different places | — |
| Check label | 2 | Duplicate links | — |
| Check detail | 10 | Same address after removing tracking details and the # fragment | F-4-3 |
| Check label | 2 | URL variants | — |
| Check detail | 5 | Possible redirect or http/https change | — |
| Check label | 2 | Link quality | — |
| Check detail | 5 | Missing titles and malformed URLs | — |
| Method label | 4 | How the audit works | — |
| Method H2 | 7 | How the audit checks and preserves bookmarks | — |
| Step | 1 | Upload | — |
| Step sentence | 8 | Choose the bookmark HTML file from your browser. | — |
| Step | 1 | Review | — |
| Step sentence | 7 | Read issues with their full folder paths. | — |
| Step | 1 | Export | — |
| Step sentence | 7 | Download corrected HTML and a review CSV. | — |
| Section label | 1 | Privacy | — |
| Privacy H2 | 6 | What this app does not do | F-4-4 |
| Privacy sentence | 9 | It does not upload or open your bookmark URLs. | — |
| Privacy sentence | 13 | Your latest real audit is kept in this browser until you forget it. | — |
| Privacy link | 3 | Read privacy details | — |
| Offline status | 5 | Offline: the audit still works. | — |
| Update status | 5 | An app update is ready. | — |
| Update action | 2 | Install update | — |
| Footer sentence | 9 | Bookmark Import Audit checks bookmark HTML files before import. | — |
| Footer link | 1 | Privacy | — |
| Footer link | 1 | Terms | — |
| Footer credit | 4 | Built by Param Factory | — |
| Footer build | 2 | build 1.0.0-r3 | — |

### Demo and populated result copy

| Location | Words | Exact copy | Flag |
| --- | --: | --- | --- |
| Banner | 6 | Demo — sample data, nothing is saved | — |
| Banner action | 2 | Reset demo | — |
| Banner action | 3 | Start for real | — |
| Result label | 2 | Audit complete | — |
| Result H2 | 3 | 6 issues found | — |
| Result state | 2 | checked locally | — |
| Result seal | 1 | Review | — |
| Gauge | 1 | Bookmarks | — |
| Gauge | 1 | Folders | — |
| Gauge | 2 | Levels deep | — |
| Gauge | 1 | Issues | — |
| Finding H3 | 4 | Folders that may merge | — |
| Finding sentence | 6 | Some bookmark apps combine same-named folders. | F-4-2 |
| Finding sentence | 9 | These full folder paths stay separate in the export. | — |
| Finding status | 2 | May merge | — |
| Finding H3 | 2 | Duplicate links | — |
| Finding sentence | 11 | Links are grouped after removing tracking details and the # fragment. | F-4-3 |
| Finding sentence | 7 | Every original link stays in the export. | — |
| Finding status | 2 | Review copies | — |
| Finding H3 | 3 | Likely URL variants | — |
| Finding sentence | 11 | These differ by http, https, www, or a known redirect link. | — |
| Finding sentence | 3 | Verify them manually. | — |
| Finding status | 2 | Verify target | — |
| Finding H3 | 5 | Missing titles and malformed URLs | — |
| Finding sentence | 6 | Blank titles get a hostname fallback. | — |
| Finding sentence | 6 | Malformed URLs remain visible for repair. | — |
| Finding status | 2 | Title fallback | — |
| Finding status | 2 | Repair URL | — |
| Export label | 2 | Corrected copy | — |
| Export H3 | 4 | Export a corrected copy | — |
| Export sentence | 4 | The download is separate. | — |
| Export sentence | 12 | It changes only folder names that may merge and fills blank titles. | — |
| Table heading | 2 | Original folder | — |
| Table heading | 2 | Exported folder | — |
| Export action | 3 | Export corrected HTML | — |
| Export action | 3 | Export review CSV | — |
| Removal action | 3 | Forget this audit | — |
| Size error | 12 | That file is over 25 MiB. Export a smaller library before auditing. | — |
| Parse error | 19 | This does not look like a bookmark HTML file. Choose the file exported by your browser or bookmark app. | — |

### README

Markdown links are counted by their visible labels; code spans count as one
word. The command block is executable syntax rather than prose.

| # | Words | Exact copy | Flag |
| --: | --: | --- | --- |
| 1 | 3 | Bookmark Import Audit | — |
| 2 | 18 | Bookmark Import Audit checks a bookmark HTML file before you move the library to a new bookmark app. | — |
| 3 | 9 | It is for people moving an old bookmark library. | — |
| 4 | 3 | What it checks | — |
| 5 | 8 | folders with the same name in different locations; | — |
| 6 | 14 | duplicate links with the same address after removing tracking details and the # fragment; | F-4-3 |
| 7 | 15 | links that differ by http, https, www, tracking details, or a known redirect link; and | — |
| 8 | 5 | missing titles and malformed URLs. | — |
| 9 | 11 | The corrected HTML keeps every bookmark URL and full folder path. | — |
| 10 | 11 | It changes only folder names that may merge and blank titles. | — |
| 11 | 9 | The review CSV gives each issue a suggested action. | — |
| 12 | 4 | Privacy and offline use | — |
| 13 | 6 | Files are processed in the browser. | — |
| 14 | 5 | Bookmark URLs are not requested. | — |
| 15 | 14 | The latest real audit stays in this browser until you choose Forget this audit. | — |
| 16 | 11 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | — |
| 17 | 8 | After the first visit, the app works offline. | — |
| 18 | 7 | Open `/?demo=1` for a separate sample audit. | — |
| 19 | 8 | It never reads or writes ordinary saved audits. | — |
| 20 | 6 | Starting for real discards demo edits. | — |
| 21 | 3 | Develop and verify | — |
| 22 | 9 | Run every command in `.factory/claims.json` from a clean checkout. | — |
| 23 | 11 | The build creates `dist/index.html`, route documents, offline files, and deployment configuration. | F-4-5 |
| 24 | 1 | Deployment | — |
| 25 | 7 | Deploy `dist/` as a static HTTPS app. | — |
| 26 | 4 | The build includes `staticwebapp.config.json`. | — |
| 27 | 14 | Browsers check pages for updates and keep versioned app files cached for one year. | F-4-6 |
| 28 | 4 | Security headers are included. | — |
| 29 | 12 | Missing URLs show the product’s designed 404 page and return HTTP 404. | — |
| 30 | 2 | Project map | — |
| 31 | 9 | `src/audit.ts` — parser, repeatable URL rules, and export functions | — |
| 32 | 8 | `src/storage.ts` — separate real and demo IndexedDB storage | — |
| 33 | 6 | `src/sw-template.js` — versioned offline cache worker | — |
| 34 | 7 | `.factory/demo.md` — demo isolation and reset behavior | — |
| 35 | 7 | `.factory/claims.json` — visitor claims and their tests | — |
| 36 | 1 | License | — |
| 37 | 1 | MIT. | — |
| 38 | 2 | See LICENSE. | — |

## Demo, storage, privacy, and offline evidence

- The first click enters `/?demo=1`; `/demo` also works directly.
- The shipped eight-bookmark sample immediately exists and produces six issues
  in all four named categories, but F-4-1 describes its below-fold placement.
- The persistent banner, **Reset demo**, and **Start for real** are present.
- A real `real-private.html` audit survived entering, editing, resetting, and
  leaving the demo. The live context contained separate
  `bookmark-import-audit` and `demo:bookmark-import-audit` databases.
- After replacing the demo with `edited-demo.html`, **Reset demo** restored
  `sample-bookmark-library.html`. Leaving and reopening the demo also restored
  the shipped sample; `edited-demo.html` was absent.
- The complete live request log contained only the product origin and no sample
  or injected bookmark hosts. No cookie, analytics, remote font, or remote
  script appeared.
- After the service worker controlled the page, a network-disabled live reload
  retained the banner, populated audit, offline notice, and CSV export.

The sandbox implementation in `src/storage.ts` opens
`demo:bookmark-import-audit` for demo state and never opens the ordinary
database through that scope. Demo-to-real navigation deletes the demo record.

## Registered claim results

A clean clone was created at `/tmp/bookmark-review4-clean.tL1pdW` from the
reviewed commit. Every command was run exactly as listed in
`.factory/claims.json` after `npm ci`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| `demo-exit-discard` | `npm run test:e2e -- --grep @claim:demo-exit-discard` | PASS |
| `audit-categories` | `npm run test:e2e -- --grep @claim:audit-categories` | PASS |
| `csv-export` | `npm run test:e2e -- --grep @claim:csv-export` | PASS |
| `corrected-export` | `npm run test:e2e -- --grep @claim:corrected-export` | PASS |
| `local-processing` | `npm run test:e2e -- --grep @claim:local-processing` | PASS |
| `privacy-inventory` | `npm run test:e2e -- --grep @claim:privacy-inventory` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `file-size-limit` | `npm run test:e2e -- --grep @claim:file-size-limit` | PASS |
| `real-audit-storage` | `npm run test:e2e -- --grep @claim:real-audit-storage` | PASS |
| `delivery-config` | `npm test -- -t @claim:delivery-config` | PASS |
| `build-output` | `npm test -- -t @claim:build-output` | PASS |
| `designed-404` | `npm run test:e2e -- --grep @claim:designed-404` | PASS |
| `license-metadata` | `npm test -- -t @claim:license-metadata` | PASS |

Each claim ID occurs in exactly one tagged test. The registered tests pass, but
F-4-2 identifies live claim-like copy outside the registry.

## Structure, routing, links, and accessibility

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An arbitrary missing path
  returns HTTP 404 with the designed page.
- Every checked route has `lang=en`, one H1, one main, ordered headings, a
  route-specific title and description, canonical, OG/Twitter metadata, the
  product image, a header, and a footer.
- Titles are 28–46 characters and follow the required root/legal/demo pattern.
- The social preview is 1200 × 630. F-1-35 records the remaining 192px Apple
  touch icon mismatch.
- History navigation updates the URL and title, announces the route, focuses
  the new H1, and restores the same behavior on Back and Forward.
- Every discovered internal link returned 200. `robots.txt`, `sitemap.xml`, the
  manifest, preview image, SVG favicon, and PNG icon returned 200. F-1-37
  records the incomplete sitemap inventory.
- No tested route has horizontal overflow at 390 px. Visible links and buttons
  are at least 44 × 44 CSS pixels.
- Steady-state live axe scans found no violations on root, demo, privacy, terms,
  or the designed 404 at mobile and desktop sizes. Images have alternatives.
- `/opt/fleet/lib/verify-url.sh` passed root and demo with one H1/main, a title,
  `lang`, labelled buttons, image alternatives, and no console errors.
- Response headers include restrictive CSP, permissions policy, anti-framing,
  nosniff, strict referrer policy, and HSTS. Initial JavaScript is 24.83 kB
  uncompressed and 8.88 kB gzip.

## Earlier finding verification

“PASS” below means the behavior was checked in the current live site and the
current source/tests. Two half-fixed rows are reopened above with their original
IDs, as required.

| Earlier ID | Status | Current evidence |
| --- | --- | --- |
| F-1-1 | PASS | Both direct actions are inside both cold viewports. |
| F-1-2 | PASS | Separate demo database, banner, reset, exit, and real-state restoration work; F-4-1 is a distinct post-click layout defect. |
| F-1-3 | PASS | Fourteen registered claims and fourteen unique tags exist. |
| F-1-4 | PASS | Browser processing copy is registered and request-log tested. |
| F-1-5 | PASS | Bookmark-host traps receive no request. |
| F-1-6 | PASS | Live offline reload and export pass. |
| F-1-7 | PASS | Corrected export preserves every source URL and path under test. |
| F-1-8 | PASS | The shipped sample exercises all four advertised categories. |
| F-1-9 | PASS | Same-name folders and malformed URL cases are present and tested. |
| F-1-10 | PASS | Browser-brand compatibility claims remain absent. |
| F-1-11 | PASS | Picker and drop enforce 25 MiB and recover after rejection. |
| F-1-12 | PASS | Four checks and same-origin requests are registered. |
| F-1-13 | PASS | “Safe deterministic” is absent; repeatable normalization has unit coverage. |
| F-1-14 | PASS | Visible URL differences are tested without fetching targets. |
| F-1-15 | PASS | “Full folder path” is consistent and export-compared. |
| F-1-16 | PASS | Tracking and fragment variants retain their original URLs. |
| F-1-17 | PASS | Only the two folder labels and blank title change in the test. |
| F-1-18 | PASS | CSV rows map to every displayed issue and have actions. |
| F-1-19 | PASS | Real persistence/forget and demo separation pass. |
| F-1-20 | PASS | The old license-storage and broad clearing copy remain absent. |
| F-1-21 | PASS | The unsupported Plus worksheet remains absent from the live app. |
| F-1-22 | PASS | The unsupported free-tier entitlement wording remains absent. |
| F-1-23 | PASS | No price or purchase offer is present. |
| F-1-24 | PASS | No checkout, merchant, or refund link/copy is present. |
| F-1-25 | PASS | Request, resource, script, font, and cookie inventories are tested. |
| F-1-26 | PASS | No live license request or license copy exists; the old module is not imported. |
| F-1-27 | PASS | The public Node support-floor sentence is absent; package metadata remains. |
| F-1-28 | PASS | `dist/index.html` and required artifacts are built and inventoried. |
| F-1-29 | PASS | README lists commands without claiming an unproved coverage matrix. |
| F-1-30 | PASS | Static deep links load and arbitrary missing paths remain 404. |
| F-1-31 | PASS | Built and live caching policies match the registered claim. |
| F-1-32 | PASS | Built and live security headers match the registered claim. |
| F-1-33 | PASS | MIT text and metadata are tagged and tested. |
| F-1-34 | PASS | Unknown URLs return the styled HTTP 404 with a way home. |
| F-1-35 | **FAIL** | Apple touch metadata exists, but its asset is 192 × 192 rather than the required 180 × 180. |
| F-1-36 | PASS | PushState, announcements, H1 focus, Back, and Forward pass. |
| F-1-37 | **FAIL** | Method/footer are fixed and `/demo` is listed, but the real `/404` route is still absent from the sitemap. |
| F-1-38 | PASS | The wordmark identifies Bookmark Import Audit. |
| F-1-39 | PASS | The hero label says “Bookmark import checker”. |
| F-1-40 | PASS | The real-file action says “Audit my bookmark HTML file”. |
| F-1-41 | PASS | Public input copy uses “bookmark HTML file”. |
| F-1-42 | PASS | Deterministic/cleaned-URL jargon remains absent from public copy. |
| F-1-43 | PASS | The method H2 names audit checks and preservation. |
| F-1-44 | PASS | Public hierarchy copy consistently uses “full folder path”. |
| F-1-45 | PASS | URL differences are described with visible examples. |
| F-1-46 | PASS | The unsupported paid section remains absent. |
| F-1-47 | PASS | Audit, issue, bookmark app/file/library, and folder-path nouns are consistent. |
| F-1-48 | PASS | No landing or README sentence exceeds 22 words. |
| F-1-49 | PASS | The hidden update action remains “Install update”. |
| F-2-1 | PASS | Demo edits are deleted on reset and every tested demo-to-real exit. |
| F-2-2 | PASS | Arbitrary missing URLs return a CSP-clean designed HTTP 404. |
| F-2-3 | PASS | Guidance and errors consistently use 25 MiB. |
| F-3-1 | PASS | The full primary action ends at y=700 on 1440 × 900. |
| F-3-2 | PASS | Live mobile demo and common navigation targets are at least 44 px. |
| F-3-3 | PASS | CSV test parses and maps every displayed finding and action. |
| F-3-4 | PASS | Corrected export compares every URL, path, folder, title, and unaffected record. |
| F-3-5 | PASS | Delivery test reads the built `dist` configuration. |
| F-3-6 | PASS | Privacy inventory has its own claim and complete request/resource checks. |
| F-3-7 | PASS | The unlisted README Node-version promise remains removed. |
| F-3-8 | PASS | The complete build-output inventory is registered. |
| F-3-9 | PASS | Browser-export compatibility wording remains narrowed. |
| F-3-10 | PASS | Copy promises a separate download; the export behavior is tested. |
| F-3-11 | PASS | Designed 404 behavior is registered and passes. |
| F-3-12 | PASS | The browser pre-script sentence remains removed. |
| F-3-13 | PASS | Registry integrity checks one unique tag per entry. |
| F-3-14 | PASS | Oversized picker and drop errors both appear and recover. |
| F-3-15 | PASS | Demo isolation copy names the saved audit. |
| F-3-16 | PASS | Reader copy says “browser”; IndexedDB appears only in developer documentation. |
| F-3-17 | PASS | “Cleaned URL” is absent; F-4-3 separately addresses the remaining fragment jargon. |
| F-3-18 | PASS | Public copy says `http/https`, not “protocol”. |
| F-3-19 | PASS | The input remains “bookmark HTML file” throughout. |
| F-3-20 | PASS | README replaces cache-control syntax with browser behavior, though F-4-6 asks for more concrete nouns. |

## Quality-gate results

The same clean clone passed:

```text
npm ci             PASS — 142 packages, 0 vulnerabilities
npm test           PASS — 14/14
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — dist/ produced
npm run test:e2e   PASS — 30/30
```

## What would make this perfect

There must be nothing left to interpret or work around:

1. Make the first demo viewport visibly populated and add a viewport-intersection
   regression test.
2. Remove or fixture-test the external importer-behavior claims.
3. Close F-1-35 with a decoded 180 × 180 Apple touch asset.
4. Resolve the `/404` route/sitemap inconsistency and close F-1-37 with an
   inventory test.
5. Apply the four exact plain-copy rewrites in F-4-3 through F-4-6.
6. Add a locally tested destination profile, or document why the generic audit
   is deliberately the final scope.
7. Re-run the complete cold read, demo sandbox, all claim commands, live request
   log, offline flow, link crawl, axe scan, history table, and clean-clone gates.

Until all findings are closed, the result remains **FAIL**.
