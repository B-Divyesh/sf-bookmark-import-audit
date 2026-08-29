# Handoff — perfection loop round 4

## Outcome

All findings in reviews 1–4 are closed. The repaired product is deployed at
<https://bookmark-import-audit.sociobot.in>.

- Repair commit: `c0d4212d0cf1607fc22f379b8a3c80fb2aa0b8c4`
- Static deployment: `fc1cec9e-85d0-4547-b1a3-6b710d55477a`
- Finding-by-finding record: `.factory/polish-4.md`
- Live browser record: `.factory/evidence/polish-4/live-verification.json`

## What changed

- `/?demo=1` and `/demo` now open directly on a populated audit. Both cold
  phone and desktop screens show the file, counts, four categories, and export
  actions without scrolling.
- Demo data stays in its own IndexedDB database. The persistent banner can
  reset the sample or discard it and start a real audit.
- Added destination-aware guidance for Generic audit and Chrome 145. The
  Chrome behavior comes from a checked-in, versioned browser fixture and only
  changes the finding that fixture supports.
- Rewrote the remaining importer, URL-fragment, privacy, build-output, and
  cache wording in direct terms.
- Added the required 180 × 180 Apple touch icon and the `/404` sitemap entry.
- Kept real route titles, metadata, focus restoration, HTTP 404 behavior,
  legal links, offline fallback, narrow-screen layout, and the existing
  product-specific ledger visual system.
- Expanded `.factory/claims.json` to 15 observable claims with exactly one
  tagged test per claim. Browser tests can now target the deployed URL with
  `PLAYWRIGHT_BASE_URL`.
- Updated the catalog line to: “Audit a bookmark HTML file for duplicate links
  and path conflicts before importing.”

## Verification

The clean clone was `/tmp/bookmark-polish4-clean.Kvkpxb` at the repair commit.

- All 15 exact commands from `.factory/claims.json`: PASS.
- `npm test`: 15/15 PASS.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/index.html` and every route artifact present.
- Local Playwright: 34/34 PASS across desktop Chromium and 390 × 844 mobile.
- Deployed Playwright: 34/34 PASS with
  `PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in`.
- Deployed axe checks: zero serious or critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, `/offline.html`, and the HTTP 404 route.
- `verify-url.sh` on live `/` and `/?demo=1`: PASS with no console errors.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Output budget: JS 27.35 kB uncompressed / 9.67 kB gzip; CSS 21.16 kB /
  5.63 kB gzip; mobile hero image 23.03 kB.
- Live headers include CSP, anti-framing, permissions, nosniff, referrer, and
  HSTS policies. The decoded Apple touch icon is exactly 180 × 180.
- Cold live screenshots are in `.factory/evidence/polish-4/`.

Run the same checks with:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e
```

## Known gaps and next steps

No required finding, stub, or TODO remains. Chrome 145 guidance intentionally
covers only the folder-path behavior established by the pinned fixture; all
other destinations use the conservative Generic audit profile.
