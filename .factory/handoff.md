# Handoff — Bookmark Import Audit v1

## What shipped

- A path-aware Netscape bookmark HTML parser that runs entirely in the browser.
- Audit groups for same-label/different-parent folder collisions, deterministic
  normalized duplicates, likely HTTP/HTTPS/`www`/redirect-wrapper variants,
  missing titles, invalid URLs, folder count, bookmark count, and maximum depth.
- A conservative corrected HTML export. It disambiguates only collision-prone
  folder labels, fills blank titles with the hostname, preserves nesting, and
  never removes a parsed bookmark.
- A review CSV with one actionable row per affected folder or bookmark.
- IndexedDB restoration of the latest audit and an explicit confirmed “Forget
  this audit” action. No bookmark URL is fetched or uploaded.
- A versioned PWA service worker with build-time precache generation, offline
  navigation fallback, cache cleanup, `clients.claim`, and user-controlled
  `skipWaiting` through the update toast. Install icons include 192, 512, and
  maskable variants.
- Empty, loading, parse-error, oversized-file, clear-audit, findings, offline,
  and update states. Drag/drop, file input, and keyboard paths are supported.
- A $9 one-time Plus upgrade through the Sociobot checkout/verification contract.
  Audit and both exports stay free; Plus only adds a locally stored migration
  sign-off worksheet. Returned/pasted licenses, daily cached verification,
  optimistic offline use, revocation messaging, and URL token stripping exist.
- Dedicated `/privacy` and `/terms` routes, an MIT license, product README,
  robots/sitemap files, and an original generated hero with provenance in
  `.factory/design.md` and `assets/src/`.

## Run and verify

```sh
npm install
npm test
npm run build
npm run test:e2e
```

The exact deploy command is `npm run build`; output is `dist/` with
`dist/index.html` at its root.

Verification on 2026-08-28:

- Unit: 7/7 Vitest tests passed.
- Browser: 6/6 Playwright tests passed across desktop Chromium and a 390 × 844
  Chromium viewport, including exports, direct legal routes, axe, and an explicit
  offline reload followed by a successful audit.
- Accessibility: axe reported zero serious or critical violations on both
  viewports. Page has one H1, named landmarks/controls, skip navigation, designed
  focus rings, 44 px targets, responsive data tables, and reduced-motion rules.
- Console/layout: zero console or page errors; document width stayed at 1440/1440
  and 390/390 during visual smoke tests.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.5 s, FCP 0.9 s, TBT 0 ms, CLS 0.
- Production payload: 29.39 KB JavaScript and 17.52 KB CSS uncompressed; responsive
  hero WebPs are 24 KB and 56 KB (fallback JPEG 128 KB).
- Dependency audit: npm reported 0 vulnerabilities.

## Known limits and next steps

- “Likely URL variants” are intentionally heuristic. The app does not crawl or
  resolve redirects, so the user must verify those rows manually.
- Netscape HTML is permissive. The parser covers the standard browser/manager
  structure and preserves the fields needed for safe migration, but vendor-only
  metadata such as favicons, tags, and custom descriptions is not reproduced.
- Static hosting must route `/privacy` and `/terms` to `index.html` as documented.
- The factory must register and production-test the `bookmark-import-audit`
  Sociobot billing product before launch; no product ID or payment secret is
  stored in this repository.
