# Polish 7 — cumulative adversarial-review closure

Repair commit: `da12853` (`fix: close review seven findings`). It was pushed to
`origin/main` and deployed as the configured static PWA at
<https://bookmark-import-audit.sociobot.in>.

This map records every distinct finding ID from reviews 1–7. Reused IDs in a
later review are called out where they were rechecked. No earlier “fixed” label
was accepted without current clean-clone and live evidence.

## Evidence key

| Key | Test or check | Screenshot / live check |
| --- | --- | --- |
| E1 | `the complete primary action is visible at 1440 by 900` | `live-root/screenshot-desktop.png`; `/` |
| E2 | `@claim:demo-isolation`; `@claim:demo-exit-discard` | `live-demo/screenshot-mobile.png`; `/?demo=1` |
| E3 | `claim registry integrity` | all 16 exact registry commands from clean clone |
| E4 | `@claim:audit-categories`; `@claim:destination-profile` | `live-demo/screenshot-desktop.png`; `/?demo=1` |
| E5 | `@claim:csv-export`; `@claim:corrected-export` | `live-demo/screenshot-desktop.png`; `/?demo=1` |
| E6 | `@claim:local-processing`; `@claim:privacy-inventory` | `live-demo/screenshot-mobile.png`; `/?demo=1` |
| E7 | `@claim:offline-reload`; `@claim:pwa-asset-update` | `live-offline/screenshot-mobile.png`; `/offline.html` |
| E8 | `@claim:file-size-limit`; empty-export recovery regression | `live-root/screenshot-mobile.png`; `/` |
| E9 | `@claim:real-audit-storage` | `live-root/screenshot-desktop.png`; `/` |
| E10 | `@claim:delivery-config`; `@claim:build-output` | `live-sitemap.xml`; live `/sitemap.xml` |
| E11 | `@claim:designed-404`; `real routes set titles, metadata, history focus, announcements, and working legal links` | `live-404/screenshot-desktop.png`; `/polish-7-missing` = HTTP 404 |
| E12 | `every mobile interactive target is at least 44 by 44 CSS pixels`; `the 390px header visibly names Bookmark Import Audit`; `keyboard, reduced motion, console, links, and accessibility pass on every route` | all four mobile screenshots; live full suite |
| E13 | `bookmark parser and audit` unit cases; copy audit | `live-root/screenshot-desktop.png`; `/` |
| E14 | `@claim:license-metadata` | live `/terms` |
| E15 | Lighthouse mobile: 100/100/100/100, FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0 | `lighthouse-live.json`; `/` |

Every E-key was run in the clean clone `/tmp/bookmark-polish7-clean.UunIGi`
where applicable. The complete deployed browser suite also passed 40/40 with
`PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in`.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-led heading, named audience, one-click sample action, result note, and real-file action above the first screen. | E1 |
| F-1-2 | Kept `?demo=1` and `/demo` isolated in `demo:bookmark-import-audit`, with sample, banner, reset, and clean exit. | E2 |
| F-1-3 | Kept `.factory/claims.json` with one unique tagged test per claim. | E3 |
| F-1-4 | Kept browser-only processing backed by a request-log test. | E6 |
| F-1-5 | Kept bookmark-host trap URLs and proves none are requested. | E6 |
| F-1-6 | Kept offline reload and CSV export after the first visit. | E7 |
| F-1-7 | Kept the separate corrected-copy wording and complete record comparison. | E5 |
| F-1-8 | Kept a realistic sample that exposes all four named issue categories. | E4 |
| F-1-9 | Kept distinct same-named paths, missing-title, and malformed-URL fixtures. | E4, E13 |
| F-1-10 | Kept broad exporter compatibility claims removed; input is a bookmark HTML file. | E13 |
| F-1-11 | Kept exact 25 MiB picker/drop boundary handling and recovery. | E8 |
| F-1-12 | Kept four local checks and complete request isolation registered. | E4, E6 |
| F-1-13 | Kept subjective matching copy removed; URL rules remain unit-tested. | E13 |
| F-1-14 | Kept visible URL-difference wording and no-following behavior. | E4, E6 |
| F-1-15 | Kept “full folder path” and compares every exported nested path. | E5 |
| F-1-16 | Kept every source URL, including tracking and anything-after-# variants. | E5 |
| F-1-17 | Kept export changes limited to folder labels that may merge and blank titles. | E5 |
| F-1-18 | Kept one actionable CSV row for every displayed issue. | E5 |
| F-1-19 | Kept real refresh/forget storage and independent disposable demo storage. | E2, E9 |
| F-1-20 | Kept obsolete license storage and broad clearing-data promises absent. | E6, E13 |
| F-1-21 | Kept the unsupported Plus worksheet absent. | E13 |
| F-1-22 | Kept unsupported free-tier entitlement copy absent. | E13 |
| F-1-23 | Kept unregistered price and purchase UI absent. | E12 |
| F-1-24 | Kept dead checkout, merchant, refund, and revocation claims absent. | E12 |
| F-1-25 | Kept a dedicated analytics, remote-resource, font, and cookie inventory. | E6 |
| F-1-26 | Kept obsolete license network behavior absent. | E6 |
| F-1-27 | Kept the Node engine metadata without an unproved public support-floor claim. | clean `npm ci`; E13 |
| F-1-28 | Kept `dist/` output documented and fully inventoried. | E10 |
| F-1-29 | Kept README test language as runnable commands, not an unproved coverage promise. | E3, E13 |
| F-1-30 | Kept real route documents, legal routes, and missing-route HTTP 404 behavior. | E10, E11 |
| F-1-31 | Kept cache policy checks against built host configuration. | E10 |
| F-1-32 | Kept CSP, permissions, anti-framing, nosniff, and referrer response policies. | E10, E11 |
| F-1-33 | Kept MIT source metadata and license-content assertion. | E14 |
| F-1-34 | Kept designed, metadata-complete 404 responses for arbitrary unknown URLs. | E11 |
| F-1-35 | Kept route-specific title, canonical, description, OG/Twitter, favicon, and 180 px touch-icon metadata. | E10, E11 |
| F-1-36 | Kept History API routes, H1 focus, polite announcements, and back/forward behavior. | E11 |
| F-1-37 | Kept the three method steps, factory/build footer, and complete public route inventory. | E10, E12 |
| F-1-38 | Kept full Bookmark Import Audit wordmark visible at 390 px. | E12 |
| F-1-39 | Kept the direct “Bookmark import checker” label. | E1, E13 |
| F-1-40 | Kept “Audit my bookmark HTML file” as the direct real-data action. | E1 |
| F-1-41 | Replaced the regressed empty-export “Netscape HTML” recovery wording with “bookmark HTML file.” | E8; live deployed bundle contains the exact new string |
| F-1-42 | Kept deterministic/cleaned-URL jargon out of public copy. | E13 |
| F-1-43 | Kept “How the audit checks and preserves bookmarks” as the useful method heading. | E1, E13 |
| F-1-44 | Kept “full folder path” as the sole hierarchy term. | E5, E13 |
| F-1-45 | Kept plain http/https, www, tracking-detail, and redirect-link wording. | E4, E13 |
| F-1-46 | Kept unsupported paid copy absent. | E13 |
| F-1-47 | Standardized audit, bookmark HTML file, bookmark library, bookmark app, issue, and full folder path. | E8, E13 |
| F-1-48 | Kept public sentences short and concrete; copy audit contains no flag. | E13 |
| F-1-49 | Kept “Install update” and a tested update prompt. | E7 |

## Reviews 2 and 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Demo-to-real navigation removes edited demo data and reseeds next entry. | E2 |
| F-2-2 | Unknown paths retain a CSP-clean, styled HTTP 404 page. | E11 |
| F-2-3 | Guidance and picker/drop validation use 25 MiB consistently. | E8 |
| F-3-1 | Desktop first-screen action remains wholly visible. | E1 |
| F-3-2 | All tested 390 px controls meet 44 × 44 px. | E12 |
| F-3-3 | CSV test parses and maps every displayed finding with an action. | E5 |
| F-3-4 | Corrected-export test compares every URL, path, folder, title, and untouched record. | E5 |
| F-3-5 | Delivery test inspects the built artifact, not source configuration. | E10 |
| F-3-6 | Privacy inventory is separately registered and verifies requests/resources/cookies. | E6 |
| F-3-7 | Unproved public Node-floor sentence remains removed. | E13 |
| F-3-8 | Build-output claim inventories route, fallback, metadata, worker, icon, and host files. | E10 |
| F-3-9 | Browser-export compatibility wording remains narrowed to the user’s bookmark HTML file. | E13 |
| F-3-10 | Copy promises a separate corrected download and the export test observes it. | E5 |
| F-3-11 | Designed HTTP 404 behavior is a registered, live-tested claim. | E11 |
| F-3-12 | The unnecessary browser pre-script promise remains absent. | E13 |
| F-3-13 | Registry integrity enforces exactly one tag per claim. | E3 |
| F-3-14 | Picker and drop share validation/error/recovery behavior. | E8 |
| F-3-15 | Demo copy names the saved audit and test proves isolation. | E2 |
| F-3-16 | Reader-facing storage copy says “this browser.” | E9, E13 |
| F-3-17 | Public matching copy says “anything after #.” | E4, E13 |
| F-3-18 | Public matching copy says http/https, not protocol. | E4, E13 |
| F-3-19 | The empty-export recovery is now also standardized to “bookmark HTML file.” | E8 |
| F-3-20 | README names cached scripts, styles, images, and icons. | E10, E13 |

## Reviews 4–6

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Demo opens with sample file, counts, categories, and exports at the top. | `one click opens a populated demo at the top of the viewport`; E2 |
| F-4-2 | Generic importer claim was removed; optional Chrome 145 rule is local, versioned, and fixture-tested. | E4 |
| F-4-3 | URL copy says “anything after #.” | E4, E13 |
| F-4-4 | Privacy heading names bookmark data. | E1, E13 |
| F-4-5 | README concretely lists Demo, Privacy, Terms, offline, and host outputs. | E10, E13 |
| F-4-6 | README concretely names scripts, styles, images, and icons in cache behavior. | E10, E13 |
| F-4-7 | Generic audit and tested Chrome 145 guidance are visibly distinct. | E4 |
| F-1-35 (review 4 recheck) | The Apple touch icon is an actual 180 × 180 PNG and every route references it. | E10 |
| F-1-37 (review 4 recheck) | The site inventory includes `/demo`, `/404`, and now `/offline.html`. | E10 |
| F-5-1 | The full wordmark remains visible in the mobile header and static offline shell. | E12 |
| F-6-1 | Offline document has skip link, header/navigation, legal footer, factory credit, and build ID. | E7, E10 |
| F-6-2 | App and static pages use the same generated build identifier. | E10 |

## Review 7

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-7-1 | Changed `src/audit.ts` empty-export recovery to “Export your bookmarks as a bookmark HTML file, then choose that file.” Added the two-project browser regression. | E8; live bundle query; `/` |
| F-7-2 | Added `https://bookmark-import-audit.sociobot.in/offline.html` to `public/sitemap.xml` and the exact `@claim:build-output` sitemap assertion. | E10; live `/sitemap.xml` |

## Final evidence

- All 16 exact claim commands: PASS from the clean clone.
- `npm test`: PASS — 16 tests; `npm run lint`, `npm run typecheck`, and
  `npm run build`: PASS.
- Full clean-clone browser suite: PASS — 40/40.
- Full deployed browser suite: PASS — 40/40.
- Cold factory verifier: PASS at root, demo, and offline; screenshots and JSON
  reports are under `.factory/evidence/polish-7/`.
- Cold arbitrary missing route: PASS — HTTP 404 with the styled document;
  screenshot and headers are in `live-404/`.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO. Full output: `.factory/evidence/polish-7/lighthouse-live.json`.

There are no deferred findings or known gaps.
