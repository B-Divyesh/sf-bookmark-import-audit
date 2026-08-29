# Handoff — polish 5

## Outcome

Released the repair at commit
`4960a9262521bb14e245508f16b847c128bb9218` and deployment
`91e5d8ff-1eef-46d7-90be-2634738686fc`:
<https://bookmark-import-audit.sociobot.in>.

The 390 px header now keeps the visible **Bookmark Import Audit** wordmark
beside the BIA instrument mark. Navigation reflows beneath it, so the product
name remains legible and every navigation target stays at least 44 px. The
first-screen sample and real-file actions remain visible before scrolling.

## What changed

- Removed the mobile rule that hid the full wordmark.
- Added a 390 px rendered-text regression test for the visible product name.
- Reflowed the mobile header into a readable wordmark row and a navigation row.
- Updated the footer build label, catalog sentence, and copy audit.
- Added final local and cold-live screenshots plus a complete finding-to-evidence
  map in `.factory/polish-5.md`.

## Verification

- Final clean clone: `/tmp/bookmark-polish5-final-clean.KYxtU5`.
- `npm ci`, every one of the 15 exact `.factory/claims.json` commands, `npm run
  lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` passed.
  The full browser run was 36/36 across desktop Chromium and 390 px Chromium.
- Final deployed `PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in
  npm run test:e2e`: 36/36 passed. Its axe integration found zero serious or
  critical findings on root, demo, privacy, terms, offline fallback, and 404.
- `verify-url.sh` cold checks passed for root and `?demo=1`: one H1, main,
  `lang=en`, zero missing image alternatives, zero unnamed buttons, and zero
  console errors. Evidence: `.factory/evidence/polish-5/live-verification.json`.
- Live routes: `/`, `/demo`, `/privacy`, and `/terms` returned 200; an arbitrary
  missing path returned 404.
- Live Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO
  100; FCP 1.0 s, LCP 1.2 s, TBT 170 ms, CLS 0.
- Final assets: initial JavaScript 27.35 kB uncompressed / 9.69 kB gzip; CSS
  21.24 kB / 5.63 kB gzip.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Deploy `dist/` as the static PWA. The host configuration and PWA artifacts are
emitted inside it.

## Known gaps

None. Every finding in reviews 1–5 is mapped and verified in
`.factory/polish-5.md`.
