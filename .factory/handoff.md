# Handoff — Bookmark Import Audit v1 repair

## Release status — **PASS**

Repair work started from verifier report commit
`7524cdc613e87b5423b0ffd229f4ce7dcb907013` for candidate
`0e980de7dc5d5cc72970046a219f4f6c0df467dc`.

The repaired product is committed and pushed to `main` at
`c88d8f5` (`fix: exclude deployment metadata from PWA precache`), after:

- `256f9ab` — `fix: configure immutable static asset delivery`
- `587b8bc` — `fix: make license verification control explicitly named`

It was deployed to https://bookmark-import-audit.sociobot.in on 2026-08-28
with Azure Static Web Apps deployment ID `a7b06496-6f23-41a5-8c5b-53fde25a2afd`.

## Release-blocking repair

The independent verifier's medium finding was reproducible on the original live
candidate: hashed JS/CSS and icons returned `Cache-Control: public,
must-revalidate, max-age=30`. The repository had no Azure Static Web Apps
configuration, so the deploy helper generated only its minimal fallback
configuration.

`public/staticwebapp.config.json` is now a tracked part of the build and
supplies the required policy:

- `/assets/*` and `/icons/*`: `public, max-age=31536000, immutable`
- HTML/navigation fallback, `/sw.js`, and `/manifest.webmanifest`: `public,
  max-age=0, must-revalidate`
- `Content-Security-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, and `X-Content-Type-Options` hardening headers.

The first configuration build exposed a related PWA installation failure:
Azure intentionally does not serve `staticwebapp.config.json`, but the
build-time service-worker precache had included it, causing `cache.addAll()` to
reject on its 404. `vite.config.ts` now excludes deployment metadata from the
precache. Regression coverage asserts both the exact header policy and this
exclusion; the live worker installs, controls the page, and serves an offline
reload again.

The collapsed license restore submit control now also has an explicit accessible
name. This removes a false positive in the factory URL verifier without changing
the existing restore workflow.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The deployment command is:

```sh
/opt/fleet/lib/deploy-static.sh bookmark-import-audit /work/repo/dist
```

`npm run build` produces `dist/` with `index.html` at its root, the tracked
`staticwebapp.config.json`, and a service worker whose precache excludes that
Azure deployment-only file.

## Verification evidence (2026-08-28)

- Clean install: `npm ci` installed 142 packages; `npm audit` reported 0
  vulnerabilities.
- Unit/integration: `npm test` passed 10/10 assertions (7 audit tests and 3
  static-host/PWA delivery regression tests).
- Quality gates: `npm run lint`, `npm run typecheck`, and `npm run build`
  passed. The added ESLint gate covers source, tests, and Vite/Playwright config.
- Production artifact: initial JS is 29.42 KB (10.66 KB gzip), CSS is 17.61 KB
  (4.99 KB gzip), responsive WebP hero variants are 23 KB and 57 KB, and the
  deploy artifact is 305,093 bytes. `dist/sw.js` contains no
  `staticwebapp.config.json` precache entry.
- Browser: `npm run test:e2e` passed 8/8 Playwright checks on desktop Chromium
  and 390 × 844 Chromium: audit/export, legal route semantics, axe,
  explicitly-named license restore control, and first-visit offline reload.
- Live identity/response check: production HTML references
  `index-D-gPIJ5e.js`, the same current build asset. `/`, `/privacy`, and
  `/terms` return 200.
- Live browser check: desktop 1440 px and mobile 390 × 844 had one H1 and one
  main landmark, no horizontal overflow, no console/page errors, and the sample
  completed with “4 review items found.” The first Tab focused “Skip to audit.”
  Axe reported 0 serious/critical violations on both viewports.
- Privacy check: an unauthenticated audit requested only
  `https://bookmark-import-audit.sociobot.in`; no bookmark URL, analytics,
  third-party font, script, or license-verification request was made.
- PWA: a fresh mobile production context reached an active service worker;
  after a controlled reload, `context.setOffline(true)` reload succeeded, the
  offline notice was visible, and the app remained controlled by the worker.
  Existing update-toast behavior is unchanged; the repaired precache now lets
  the worker reach that lifecycle correctly.
- Factory URL verification: `verify-url.sh` returned HTTP 200 in 678 ms with
  no console errors, title/lang/one H1/main present, zero images missing alt,
  and `buttonsUnlabeled: 0`.
- Response policy: live hashed JS, CSS, and icon responses return
  `public, max-age=31536000, immutable`; `/`, `sw.js`, and the manifest return
  `public, max-age=0, must-revalidate`. Live responses include the restrictive
  same-origin CSP, permissions policy, and `X-Frame-Options: DENY`.
- Lighthouse (live mobile): Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 10 ms, CLS 0.

## What shipped

- A path-aware local Netscape bookmark HTML parser and conservative corrected
  HTML/CSV exports.
- IndexedDB restoration and explicit removal of the latest audit; no bookmark
  URL is fetched or uploaded.
- A versioned offline PWA with update toast, manifest, app-shell precache, and
  offline navigation fallback.
- Free audit/export plus an optional Sociobot one-time license for a local
  migration sign-off worksheet.
- Dedicated privacy and terms routes, MIT license, original generated hero,
  and documented visual system.

## Known limits

- Likely URL variants are intentionally heuristic. The app does not crawl or
  resolve redirects, so the user must verify those rows manually.
- Vendor-only Netscape metadata such as favicons, tags, and custom descriptions
  is not reproduced.
- The factory must register and production-test the Sociobot billing product
  before launch; no product ID or payment secret is stored in this repository.
