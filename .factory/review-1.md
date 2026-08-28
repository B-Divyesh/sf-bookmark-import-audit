# Adversarial first-read review 1 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 2026-08-28 against commit `544ee4e0c7ef03608fca82a47a1c9a26af391111` and the live site at <https://bookmark-import-audit.sociobot.in>. There are blocking findings. The product cannot pass while the demo overwrites ordinary saved state, the claim registry is absent, the paid CTA is dead, and missing routes masquerade as the home page.

## Cold first read

Fresh Chromium contexts were used at 390 × 844 and 1440 × 900 with no stored site data.

| Question | First-screen answer |
| --- | --- |
| What does it do? | It checks a browser bookmark export for folder merges, duplicate links, URL variants, and missing titles. |
| Who is it for? | A person moving a bookmark library to a new bookmark manager. This is inferable from the 18-word lede, though it is not stated directly as “for people moving…”. |
| What should I click first? | Not clear enough. The only first-screen action is the metaphorical “Go to the audit bench”; “Try a small example” is below the first screen. At 1440 × 900 the CTA sits against the lower viewport edge. |

The headline “Inspect before you import.” is short and job-led. The visual system is distinctive: the ivory graph-paper surface, navy instrument casing, narrow labels, orange signal color, and original console image do not resemble a generic SaaS template. Those passes do not offset the unclear first action.

## Blocking findings

### F-1-1 — The first screen does not name the first result or expose the one-click sample

- **Location/quote:** hero CTA, “Go to the audit bench”; below-fold control, “Try a small example”.
- **Why this fails:** “audit bench” is product lore, not an action or result. A cold visitor cannot tell whether the first click uploads a file, opens the tool, or starts a sample. The required sample action is not on the first screen.
- **Fix:** use the audience sentence “For people moving an old bookmark library, find risky folder merges and duplicate links before importing.” Put **Try it with sample data** on the first screen with “See a completed four-issue audit; nothing is saved.” Add **Audit my bookmark file** as the real-data action.

### F-1-2 — The sample is not a demo sandbox and overwrites real saved work

- **Location/quote:** `/demo`, `/?demo=1`, and “Try a small example”. No “Demo — sample data, nothing is saved” banner, **Reset demo**, or **Start for real** control exists. `.factory/demo.md` is absent.
- **Evidence:** `/demo` and `/?demo=1` render the ordinary home app. In a fresh context, the sample wrote `example-bookmarks.html` into IndexedDB database `bookmark-import-audit`, object store `state`. A separate live check loaded `private.html`, clicked the sample, reloaded, and found `example-bookmarks.html`; the sample had replaced the ordinary saved audit. The sample is only four `example.com` bookmarks, not a realistic old library.
- **Why this fails:** demo actions share the real storage namespace and can destroy the visitor’s last saved audit. There is no way to reset the demo or leave it cleanly.
- **Fix:** make `/demo` a real route backed only by a `demo:` IndexedDB namespace (or memory), seed a realistic multi-folder library, show the required persistent banner and controls, and never read or write the ordinary `state` store. Add `.factory/demo.md` and an end-to-end isolation test that proves an existing real audit survives demo use and reset.

### F-1-3 — The required claim registry does not exist

- **Location:** `.factory/claims.json` is absent.
- **Why this fails:** there are no listed claim commands to run and no `@claim:<id>` tests. Passing general unit and end-to-end tests does not make the live promises traceable or complete.
- **Fix:** create `.factory/claims.json`; give every retained promise below exactly one tagged sandbox test. Remove any promise that cannot be observed and tested.

Every row below is a separate unlisted-claim finding. Each is blocking because no matching claim entry or tagged test exists.

| ID | Exact quote and location | Required concrete fix/test |
| --- | --- | --- |
| F-1-4 | Landing: “Runs on this device”; “Bookmark Import Audit runs locally.” README: “Parsing, normalization, repair, and export happen in the browser.” Privacy: “Bookmark Import Audit processes files entirely in your browser.” | Add one local-processing claim and a `/demo` request-log test that audits and exports while allowing only same-origin app assets. |
| F-1-5 | Landing: “No crawling or upload”; “No bookmark leaves this device.” README: “Bookmark URLs are never requested.” Privacy: “We do not upload, crawl, sell, or analyze your bookmarks.” and “The audit engine makes no network requests for bookmark URLs.” | Add a privacy claim test that uses unique trap URLs and fails on any request to them or any non-allowlisted origin. |
| F-1-6 | README: “After the first visit, the versioned service worker serves the complete app offline.” Dynamic landing copy: “Offline mode: the audit still works.” | Add `@claim:offline-reload` using `/demo`, then take the context offline, reload, audit, and export. The behavior passed an ad hoc live check but remains unlisted. |
| F-1-7 | Landing: “Original stays untouched.” README: “The corrected Netscape HTML preserves every bookmark and nesting level.” Privacy/terms: “The corrected export preserves every parsed bookmark and changes collision-prone folder labels.” | Add a preservation test comparing input bookmark IDs, URLs, and folder depth with the corrected export; rewrite “Original stays untouched” as “The app never changes your uploaded file.” |
| F-1-8 | Landing: “Find folder merges, duplicate links, URL variants, and missing titles before a new bookmark manager changes your library.” README: “It finds import hazards before a destination manager can flatten or merge the library’s meaning.” | Add a sample fixture with one observable case for each named issue and assert the result, not only the presence of controls. |
| F-1-9 | README bullets: “same-named folders under different parent paths, which path-insensitive importers may merge;” and “blank titles and malformed URLs.” | Add fixture assertions for both cases. Rewrite the first as “folders with the same name in different locations, which some bookmark apps may combine”. |
| F-1-10 | Landing: “Chrome, Firefox, Safari, Edge, Linkwarden, and most bookmark tools export this format.” | Ship fixtures from every named exporter and test them, or narrow the copy to “Upload a Netscape bookmark HTML file.” |
| F-1-11 | Landing: “Maximum 25 MB.” | Add a boundary test proving 25 MiB is accepted and 25 MiB + 1 byte is rejected. |
| F-1-12 | Landing: “Four checks.” and “Zero network lookups.” | Add a claim test that asserts all four categories on the sample and records the complete request log. |
| F-1-13 | Landing: “Safe deterministic matching.” README: “exact normalized URL duplicates after removing fragments, known tracking parameters, query-order differences, and trailing slashes;” | Remove subjective “Safe”; add repeatable normalization cases and assert byte-identical results across runs. |
| F-1-14 | Landing: “Marked as likely, never assumed”; “The app recognizes scheme, host, and wrapper patterns locally.”; “It never claims to have followed a URL.” README: “likely URL variants across HTTP/HTTPS, www, or recognizable redirect-wrapper parameters—reported honestly without fetching any URL;” Privacy: “It does not resolve redirects.” | Add fixtures for every stated pattern plus a request-log assertion; rewrite “wrapper patterns” as “redirect-link patterns”. |
| F-1-15 | Landing: “Folders are compared by their full ancestry.” and “A ‘Research’ folder under Work stays distinct from ‘Research’ under Personal.” | Add a nested-folder fixture and assert separate paths in both the audit and corrected export. Use “full folder path” instead of “full ancestry”. |
| F-1-16 | Landing: “Tracking parameters and fragments are ignored for review, but every link remains in the corrected HTML.” | Test ignored parameters/fragments and verify that all original URLs remain present in the downloaded HTML. |
| F-1-17 | README: “It only disambiguates collision-prone folder labels and supplies hostname fallbacks for blank titles.” Landing result copy: “Only collision-prone folder labels and blank titles are made import-safe.” | Add exact before/after export assertions. Replace “collision-prone” with “folder names that may merge”. |
| F-1-18 | README: “The review CSV records each finding and suggested action.” | Add a CSV claim test that checks its header and one row per displayed finding. |
| F-1-19 | README: “The latest audit is stored in IndexedDB so it survives a refresh and can be explicitly forgotten.” Privacy: “Your latest parsed audit and, if unlocked, your migration worksheet are kept in IndexedDB so work survives a refresh.” and “Use ‘Forget this audit’ to remove the audit.” | Add persistence and removal tests in the real namespace, plus the isolation test in F-1-2. |
| F-1-20 | Privacy: “Your license token and a daily verification verdict are kept in localStorage.” and “Clearing this site’s browser data removes everything.” | Add storage-key assertions and a clean-context clearing test, or remove the broad “everything” promise. |
| F-1-21 | Landing: “Plus adds a locally saved destination worksheet, verification checklist, and migration notes.” README has the same feature promise. | Add a recorded successful-license fixture and assert saving/reloading each promised field without a live paid call. |
| F-1-22 | Landing: “The full audit, corrected HTML, CSV, accessibility, and safety guidance stay free.” README: “Everything above is free.” Terms: “The free audit and export tools may be used without an account.” | Add an unauthenticated demo test that completes and downloads every named free output. Replace the untestable “accessibility” entitlement with a concrete feature or remove it. |
| F-1-23 | Landing price block: “$9” / “one time”. README: “The optional $9 one-time Plus license adds a locally saved destination sign-off worksheet.” Terms: “Plus is a one-time purchase for one person’s use.” | Add a price/config assertion against the registered Sociobot product, or do not advertise the tier until registration exists. |
| F-1-24 | Landing: “Checkout is hosted by Sociobot/Dodo, the merchant of record.” and “Refunds are handled there and revoke the license.” README: “Checkout and license verification use the Sociobot billing API; no payment provider is embedded in the app.” | The live checkout URL currently returns HTTP 404 with `{"error":"enabled factory product"}`. Register and test the product end to end, then add a claim test for the redirect and a recorded verification/revocation fixture. Remove refund/revocation copy if it cannot be sandbox-tested. |
| F-1-25 | README/privacy: “There are no analytics, third-party scripts, remote fonts, or tracking cookies.” Privacy also says there are no “page-view beacons”. | Add a clean-context request/cookie/script/font inventory test covering the whole demo flow. |
| F-1-26 | Privacy: “The only optional request is license verification with Sociobot when you enter or receive a license.” | Test that no license call occurs without explicit submission and that only `api.sociobot.in` is contacted after submission. |
| F-1-27 | README: “Requires Node.js 20 or newer.” | Add a CI/runtime-engine check or an `engines.node` constraint and test the supported floor. |
| F-1-28 | README: “The reproducible deploy command is `npm run build`.” and “It creates `dist/` with `dist/index.html` at its root.” | Add a tagged clean-build claim test that asserts the output path and required artifacts. |
| F-1-29 | README: “End-to-end tests use Playwright 1.58.2 and cover desktop, a 390 px viewport, offline reload, downloads, legal routing, and axe serious/critical accessibility checks.” | Either list and tag each observable claim or rewrite as a factual command description and keep a test that enumerates both configured projects and expected tagged cases. |
| F-1-30 | README: “Deploy the contents of `dist/` as a static SPA with HTTPS and route fallback to `index.html` (so `/privacy` and `/terms` resolve directly).” | Add a production-route test for every sitemap route and the required 404. The current catch-all also hides missing routes, so this claim is incomplete. |
| F-1-31 | README: “The build includes `staticwebapp.config.json` for Azure Static Web Apps: HTML, the manifest, and `sw.js` are revalidated while immutable assets are cached for one year.” | Add the existing header assertions as a tagged claim and run them against the deployed URL. |
| F-1-32 | README: “It also sets the product's CSP, permissions, and anti-framing response policies.” | Add a tagged live-response test for all three headers. Ad hoc checks passed but there is no claim entry. |
| F-1-33 | Terms: “The source code is also available under the MIT License.” README license section: “MIT.” | Add a repository claim test that checks `LICENSE` and the linked source, or treat this as release metadata in a tested manifest. |

### F-1-34 — Missing URLs render the home page as HTTP 200

- **Location/evidence:** live `/404` and `/definitely-missing` both returned HTTP 200, title “Bookmark Import Audit — inspect before you import”, and the home H1. `public/staticwebapp.config.json` has no `responseOverrides.404`; there is no 404 page.
- **Why this fails:** the routing is broken and misleading. Visitors, crawlers, and assistive technology cannot distinguish a missing resource from the product home.
- **Fix:** add a designed 404 page in the product’s instrument-panel style, return HTTP 404 for unknown routes, include a clear home action, and configure Azure `responseOverrides` without combining a route rewrite and status code.

## Other findings

### F-1-35 — Required social and canonical metadata is absent

- **Location:** live `<head>` and `index.html`.
- **Exact omissions:** no canonical link; no `og:title`, `og:description`, or `og:image`; no Twitter card; no apple-touch icon. The SVG favicon, `lang`, theme color, description, and per-implemented-route titles are present.
- **Why this matters:** shared links have no product-specific preview and duplicate route variants have no canonical URL.
- **Fix:** add route-aware canonical metadata, a 1200 × 630 image derived from the console art, OG/Twitter tags, and a 180 px apple-touch icon. Give `/demo` the title “Demo — Bookmark Import Audit”.

### F-1-36 — Navigation does not implement route focus or announcements

- **Location:** `src/main.ts`; no `pushState`, `popstate`, route-focus call, or route-announcement region exists. Header links trigger full page loads.
- **Why this matters:** the app does not meet the required predictable SPA navigation behavior, and a screen-reader user is not moved to or told about the new H1.
- **Fix:** use History API routing for internal links; on every route change set the route title, focus a `tabindex="-1"` H1, and announce it in a polite live region. Test deep-link reload plus back/forward restoration.

### F-1-37 — The standard landing skeleton is incomplete

- **Location:** landing structure, footer, and `public/sitemap.xml`.
- **Exact gaps:** there is no “How it works” three-step section; the footer omits “Built by Param Factory” and a version/build ID; the sitemap omits `/demo` and the future 404 route.
- **Why this matters:** visitors get method details but not the required upload → review → export sequence, and release provenance is missing.
- **Fix:** add three verb-led steps using the real UI; add factory credit and build ID to every footer; list all public routes in the sitemap after `/demo` and 404 exist.

### F-1-38 — “Field instrument 01” is unexplained brand lore

- **Location/quote:** desktop wordmark, “Field instrument 01”.
- **Why this matters:** it does not identify the product or a usable function and could appear on an unrelated tool.
- **Fix:** replace it with “Bookmark Import Audit”.

### F-1-39 — “Local migration instrument” is a mood label, not a section name

- **Location/quote:** hero eyebrow, “Local migration instrument”.
- **Why this matters:** “instrument” adds theme but no instruction.
- **Fix:** “Bookmark import checker”.

### F-1-40 — “Go to the audit bench” is metaphorical action copy

- **Location/quote:** hero CTA, “Go to the audit bench”.
- **Why this matters:** it does not name what clicking accomplishes.
- **Fix:** “Audit my bookmark file”.

### F-1-41 — “Input / Netscape HTML” leads with a legacy format name

- **Location/quote:** upload eyebrow, “Input / Netscape HTML”; README, “The corrected Netscape HTML…”.
- **Why this matters:** a first-time visitor may not know that their browser’s bookmark export uses this format.
- **Fix:** use “Upload a browser bookmark HTML file”; explain “Netscape bookmark HTML” once in supporting text.

### F-1-42 — “Deterministic” is repeated without explaining the user-visible rule

- **Location/quotes:** “Safe deterministic matching”; “Method / deterministic”; README “deterministic audit logic”.
- **Why this matters:** the technical adjective does not explain what is matched or why the result is trustworthy.
- **Fix:** “Matches the same cleaned URL”; “How the audit works”; README “repeatable URL-matching rules”.

### F-1-43 — “No black box. No surprise deletions.” is a metaphorical slogan

- **Location/quote:** method H2, “No black box. No surprise deletions.”
- **Why this matters:** the heading does not name the section when heard out of context.
- **Fix:** “How the audit checks and preserves bookmarks”.

### F-1-44 — “Path-aware”, “full ancestry”, and “path-insensitive importers” name one concept three ways

- **Location/quotes:** image caption “Path-aware inspection”; landing “full ancestry”; README “path-insensitive importers”.
- **Why this matters:** the inconsistent technical terms make a simple folder-path check sound like three different concepts.
- **Fix:** use “full folder path” throughout. Example: “Checks each folder’s full path, so Work / Research stays separate from Personal / Research.”

### F-1-45 — URL-analysis copy uses unexplained implementation terms

- **Location/quotes:** “scheme, host, and wrapper patterns”; README “normalized URL duplicates”, “query-order differences”, and “redirect-wrapper parameters”.
- **Why this matters:** visitors need to know which visible differences are grouped, not parser terminology.
- **Fix:** “Groups links that differ only by `http`/`https`, `www`, tracking details, or a known redirect link.”

### F-1-46 — The paid heading does not name the section or price

- **Location/quotes:** “Optional one-time unlock” and “Carry a signed-off migration plan.”
- **Why this matters:** the first is product jargon and the second is a vague slogan; neither clearly labels pricing.
- **Fix:** eyebrow “Plus plan”; H2 “Save a migration checklist — $9 once”.

### F-1-47 — Core nouns change across the landing page and README

- **Location/quotes:** “audit”, “inspection”, “safety check”; “bookmark manager”, “destination manager”, “bookmark tools”; “review items”, “findings”, “import hazards”.
- **Why this matters:** a visitor must infer whether these refer to different products, inputs, or results.
- **Fix:** standardize on “audit” for the process, “bookmark app” for the destination, and “issues” for results. Rewrite the README opening: “Bookmark Import Audit checks a browser bookmark export before you move it to a new bookmark app. It shows folder merges, duplicate links, URL variants, and missing titles.”

### F-1-48 — One README sentence exceeds the 22-word limit

- **Location/quote:** README Deployment, 24 words: “The build includes `staticwebapp.config.json` for Azure Static Web Apps: HTML, the manifest, and `sw.js` are revalidated while immutable assets are cached for one year.”
- **Why this matters:** it combines the artifact, host, and two cache policies.
- **Fix:** “The build includes `staticwebapp.config.json` for Azure Static Web Apps. It revalidates HTML, the manifest, and `sw.js`. It caches immutable assets for one year.”

### F-1-49 — “Refresh” does not name the update result

- **Location/quote:** hidden update-toast button, “Refresh”.
- **Why this matters:** the label does not say that it activates a waiting app update.
- **Fix:** “Install update”.

## Copy audit

Word counts use whitespace-delimited words. The landing inventory covers every sentence or sentence-like statement visible in the cold default state; dynamic audit results and legal-route copy are outside this landing-copy inventory. Claim flags point to the blocking findings above. No banned marketing adjective appears.

### Landing page sentences

| # | Words | Exact copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 4 | Inspect before you import. | — |
| 2 | 18 | Find folder merges, duplicate links, URL variants, and missing titles before a new bookmark manager changes your library. | F-1-1, F-1-8, F-1-47 |
| 3 | 4 | Runs on this device | F-1-4 |
| 4 | 4 | No crawling or upload | F-1-5 |
| 5 | 3 | Original stays untouched | F-1-7 |
| 6 | 10 | Path-aware inspection: the branch matters as much as the label. | F-1-44 |
| 7 | 4 | Load a browser export | — |
| 8 | 12 | Chrome, Firefox, Safari, Edge, Linkwarden, and most bookmark tools export this format. | F-1-10, F-1-47 |
| 9 | 3 | Maximum 25 MB. | F-1-11 |
| 10 | 2 | Four checks. | F-1-12 |
| 11 | 3 | Zero network lookups. | F-1-12 |
| 12 | 4 | Same label, different path | — |
| 13 | 3 | Safe deterministic matching | F-1-13, F-1-42 |
| 14 | 5 | Marked as likely, never assumed | F-1-14 |
| 15 | 4 | Titles and malformed URLs | — |
| 16 | 3 | No black box. | F-1-43 |
| 17 | 3 | No surprise deletions. | F-1-43 |
| 18 | 7 | Folders are compared by their full ancestry. | F-1-15, F-1-44 |
| 19 | 11 | A “Research” folder under Work stays distinct from “Research” under Personal. | F-1-15 |
| 20 | 16 | Tracking parameters and fragments are ignored for review, but every link remains in the corrected HTML. | F-1-16 |
| 21 | 9 | The app recognizes scheme, host, and wrapper patterns locally. | F-1-14, F-1-45 |
| 22 | 8 | It never claims to have followed a URL. | F-1-14 |
| 23 | 5 | Carry a signed-off migration plan. | F-1-46 |
| 24 | 12 | Plus adds a locally saved destination worksheet, verification checklist, and migration notes. | F-1-21 |
| 25 | 12 | The full audit, corrected HTML, CSV, accessibility, and safety guidance stay free. | F-1-22 |
| 26 | 9 | Checkout is hosted by Sociobot/Dodo, the merchant of record. | F-1-24 |
| 27 | 8 | Refunds are handled there and revoke the license. | F-1-24 |
| 28 | 4 | See privacy and terms. | — |
| 29 | 5 | Bookmark Import Audit runs locally. | F-1-4 |
| 30 | 5 | No bookmark leaves this device. | F-1-5 |
| 31 | 7 | Generated hero artwork disclosed in the source. | — |

### README sentences and list statements

| # | Words | Exact copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 17 | Bookmark Import Audit is a local, offline-capable safety check for people moving an old browser bookmark library. | F-1-6, F-1-47 |
| 2 | 15 | It finds import hazards before a destination manager can flatten or merge the library’s meaning. | F-1-8, F-1-47 |
| 3 | 11 | same-named folders under different parent paths, which path-insensitive importers may merge; | F-1-9, F-1-44 |
| 4 | 15 | exact normalized URL duplicates after removing fragments, known tracking parameters, query-order differences, and trailing slashes; | F-1-13, F-1-45 |
| 5 | 15 | likely URL variants across HTTP/HTTPS, www, or recognizable redirect-wrapper parameters—reported honestly without fetching any URL; | F-1-14, F-1-45 |
| 6 | 5 | blank titles and malformed URLs. | F-1-9 |
| 7 | 10 | The corrected Netscape HTML preserves every bookmark and nesting level. | F-1-7, F-1-41 |
| 8 | 13 | It only disambiguates collision-prone folder labels and supplies hostname fallbacks for blank titles. | F-1-17, F-1-44 |
| 9 | 9 | The review CSV records each finding and suggested action. | F-1-18, F-1-47 |
| 10 | 4 | Everything above is free. | F-1-22 |
| 11 | 13 | The optional $9 one-time Plus license adds a locally saved destination sign-off worksheet. | F-1-21, F-1-23 |
| 12 | 17 | Checkout and license verification use the Sociobot billing API; no payment provider is embedded in the app. | F-1-24 |
| 13 | 9 | Parsing, normalization, repair, and export happen in the browser. | F-1-4, F-1-42 |
| 14 | 5 | Bookmark URLs are never requested. | F-1-5 |
| 15 | 17 | The latest audit is stored in IndexedDB so it survives a refresh and can be explicitly forgotten. | F-1-19 |
| 16 | 11 | There are no analytics, third-party scripts, remote fonts, or tracking cookies. | F-1-25 |
| 17 | 13 | After the first visit, the versioned service worker serves the complete app offline. | F-1-6 |
| 18 | 5 | Requires Node.js 20 or newer. | F-1-27 |
| 19 | 8 | The reproducible deploy command is `npm run build`. | F-1-28 |
| 20 | 8 | It creates `dist/` with `dist/index.html` at its root. | F-1-28 |
| 21 | 22 | End-to-end tests use Playwright 1.58.2 and cover desktop, a 390 px viewport, offline reload, downloads, legal routing, and axe serious/critical accessibility checks. | F-1-29 |
| 22 | 9 | `src/audit.ts` — parser, deterministic audit logic, and HTML/CSV exports | F-1-42 |
| 23 | 5 | `src/storage.ts` — local IndexedDB state | — |
| 24 | 6 | `src/license.ts` — one-time Sociobot license flow | — |
| 25 | 7 | `src/sw-template.js` — generated, versioned offline cache worker | — |
| 26 | 8 | `.factory/design.md` — visual system and original image provenance | — |
| 27 | 7 | `.factory/handoff.md` — build verification and known limitations | — |
| 28 | 22 | Deploy the contents of `dist/` as a static SPA with HTTPS and route fallback to `index.html` (so `/privacy` and `/terms` resolve directly). | F-1-30 |
| 29 | 24 | The build includes `staticwebapp.config.json` for Azure Static Web Apps: HTML, the manifest, and `sw.js` are revalidated while immutable assets are cached for one year. | F-1-31, F-1-48 |
| 30 | 11 | It also sets the product's CSP, permissions, and anti-framing response policies. | F-1-32 |
| 31 | 14 | Infrastructure, DNS, and billing product registration are handled outside this repository by the factory. | — |
| 32 | 1 | MIT. | F-1-33 |
| 33 | 2 | See LICENSE. | — |

### Non-sentence headings, labels, and actions

| Exact copy | Result |
| --- | --- |
| “Field instrument 01” | Fail — F-1-38 |
| “Local migration instrument” | Fail — F-1-39 |
| “Go to the audit bench” | Fail — F-1-40 |
| “Input / Netscape HTML” | Fail — F-1-41 |
| “Method / deterministic” | Fail — F-1-42 |
| “Optional one-time unlock” | Fail — F-1-46 |
| “Try a small example” | Fail as the required demo action — F-1-1/F-1-2; use “Try it with sample data” |
| “Refresh” | Fail — F-1-49 |
| “Choose bookmark HTML”, “Export corrected HTML”, “Export review CSV”, “Forget this audit”, “Verify license”, “Buy Plus” | Pass wording: verb plus named result. “Buy Plus” still leads to a dead URL (F-1-24). |

## Demo, privacy, offline, and storage evidence

- The first screen after clicking the sample did show an active result at “4 review items found”, but it was only a four-bookmark `example.com` fixture.
- The only requests during the sample/offline flow were same-origin HTML, hashed JS/CSS, and the product image. No sample bookmark URL, analytics host, font CDN, or license endpoint was requested.
- After service-worker activation, the live `/demo` page reloaded offline and produced the four-item result. This confirms the observable offline behavior, but not a compliant demo because `/demo` is not isolated.
- Demo Reset and Start for real could not be tested because neither exists.

## Claims and clean-clone results

There were zero listed claim tests because `.factory/claims.json` is missing.

From a fresh local clone:

```text
npm ci             PASS — 142 packages, 0 vulnerabilities
npm test           PASS — 10/10
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — dist/ produced; JS 29.42 kB (10.66 kB gzip)
npm run test:e2e   PASS — 8/8
```

These tests are not tagged claim tests and do not exercise a separate demo namespace.

## Structure, links, and accessibility

- Root, `/privacy`, and `/terms` return 200 and render one H1 and one main landmark. Their implemented titles follow the required pattern.
- `/demo`, `/404`, and an arbitrary missing path return the home page with the home title. F-1-34 applies.
- Live link crawl: home, Privacy, Terms, source, robots, sitemap, and favicon resolved after retry. **Buy Plus returned 404**. No other dead link was found.
- Root metadata has `lang="en"`, a ≤155-character description, theme color, SVG favicon, and manifest. F-1-35 lists the omissions.
- Live axe scans at 390 × 844 and 1440 × 900 found zero serious or critical violations. The first keyboard stop is the skip link; focus styling and reduced-motion behavior are covered by the passing suite.
- The visual identity is distinct and matches `.factory/design.md`; no generic-template finding is raised.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The prior handoff and two verification files were checked from scratch:

- Previous immutable-cache defect: fixed in code and live. Hashed JS returns `Cache-Control: public, max-age=31536000, immutable`.
- Previous missing hardening headers: fixed in code and live. CSP, Permissions-Policy, anti-framing, nosniff, and referrer headers are present.
- Previous service-worker precache failure: fixed. The clean end-to-end suite passes and a live offline reload works.
- Previous unnamed license verification control: fixed. The button has the accessible name “Verify license” and its regression test passes.

No earlier finding is reopened. The handoff’s known gap—billing product registration—has become the live dead-CTA finding F-1-24.

## Missed leverage

No AI feature is warranted. The core job is deterministic, private comparison; sending bookmark data to a model would weaken the product’s privacy premise. Corrected HTML and review CSV already cover the obvious import/export leverage. No decorative AI or embedded provider key was found.

## What would make this perfect

Resolve every finding above. In particular: make the sample a first-screen, realistic, isolated `/demo`; register every retained promise and test it by tag; make checkout work; add a real 404 and complete metadata/routing; replace the instrument-lore copy with direct actions; and ship only when the claim table has no untested row and a repeat review produces zero findings.
