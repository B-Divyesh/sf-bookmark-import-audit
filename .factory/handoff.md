# Handoff — polish 6

## Outcome

All findings from adversarial reviews 1–6 are closed. The release keeps the
mid-century migration-console identity and the `pwa-offline` artifact class.
Implementation commit `3f71e14ee2de8424ad3571e87ffbd6d3e2906989` is deployed
at <https://bookmark-import-audit.sociobot.in> through deployment
`7224e977-8506-42a5-8e5f-b79f4fa55ee6`.

Round 6 completes the offline page's route metadata and common shell. It also
generates one `1.0.0-r6` build label for app, offline, and 404 pages from
`src/release.ts`. The complete cumulative mapping is `.factory/polish-6.md`.

## Changes

- Added description, canonical URL, Open Graph and Twitter metadata, favicon,
  180 px touch icon, and manifest links to `/offline.html`.
- Added the standard skip link, full product wordmark, site navigation, legal
  links, factory credit, and build provenance to `/offline.html`.
- Preserved the navy, ivory, graph-paper, orange-signal instrument-panel style
  on the offline route at desktop and 390 px widths.
- Replaced hard-coded app and 404 build labels with one release constant and a
  build-time substitution for script-free static pages.
- Extended `@claim:build-output` to inspect metadata on every emitted HTML page,
  both static shells, app-bundle release provenance, and unresolved placeholders.
- Extended the browser route test to cover offline metadata, icons, manifest,
  legal links, common shell, and one build ID on every live route.
- Updated the catalog line to the 74-character verb-first sentence: “Audit
  bookmark HTML for duplicate links and folder conflicts before you import.”

## Verification

Clean clone: `/tmp/bookmark-polish6-clean.H326YS` at `3f71e14`.

- `npm ci`: PASS — 142 packages, zero vulnerabilities.
- Every one of the 15 exact commands in `.factory/claims.json`: PASS. Browser
  claims passed in both desktop Chromium and the 390 px project.
- `npm test`: PASS — 15/15 unit, registry, artifact, and policy tests.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS — `dist/` created.
- `npm run test:e2e`: PASS — 36/36 clean-clone browser tests.
- Deployed `npm run test:e2e`: PASS — 36/36 against the public origin.
- URL verifier: PASS on `/`, `/?demo=1`, `/offline.html`, and `/404`; each has
  one H1/main, `lang=en`, labelled controls, and zero console errors.
- Axe integration: zero serious or critical issues on home, demo, Privacy,
  Terms, offline, and the HTTP 404 in both browser projects.
- Offline claim: PASS after a controlled online visit, offline reload, retained
  isolated demo, and CSV download.
- Privacy claims: PASS with same-origin request inventory, trap bookmark hosts,
  no analytics, no remote script/font, and no cookie.
- Live cold route audit: every page has its own title and canonical, full social
  and app metadata, header/footer, legal links, build `1.0.0-r6`, and no 390 px
  overflow. `/round-6-missing` returns HTTP 404.
- Live/local SHA-256 values match for JavaScript, CSS, `offline.html`, and
  `404.html`; see `.factory/evidence/polish-6/live-route-summary.json`.

## Performance

The production build ships 27.36 kB JavaScript (9.70 kB gzip) and 21.24 kB CSS
(5.63 kB gzip). Live mobile Lighthouse scored Performance 100, Accessibility
100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.1 s, TBT 10 ms, and
CLS 0. The report is `.factory/evidence/polish-6/lighthouse-live.json`.

## Evidence

- `.factory/evidence/polish-6/live-route-summary.json`
- `.factory/evidence/polish-6/live-root/verify.json`
- `.factory/evidence/polish-6/live-demo/verify.json`
- `.factory/evidence/polish-6/live-offline/verify.json`
- `.factory/evidence/polish-6/live-404/verify.json`
- `.factory/evidence/polish-6/live-offline/screenshot-mobile.png`
- `.factory/evidence/polish-6/live-demo/screenshot-mobile.png`
- `.factory/evidence/polish-6/lighthouse-live.json`

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Deploy the contents of `dist/` through the static work-order deployment. Do not
add a navigation fallback; real route documents and the HTTP 404 override are
part of the tested contract.

## Known gaps and next steps

None. No finding is deferred, and no infrastructure, DNS, billing, or feature
work remains for this repair round.
