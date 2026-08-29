# Handoff — adversarial review 6

## Outcome

Completed an independent cold-read, copy, demo, claims, sandbox, history,
structure, accessibility, and missed-leverage review of
<https://bookmark-import-audit.sociobot.in> at repository commit `0d671083`.
The verdict is **FAIL** with one reopened blocking finding and two minor
findings. Product code was not changed.

The full report is `.factory/review-6.md`.

## What was checked

- Fresh 390 × 844 and 1440 × 900 browser contexts before scrolling.
- Every landing-page and README sentence, heading, fact, label, and action.
- One-click demo population, reset, exit discard, real-data isolation,
  same-origin request behavior, downloads, and offline reload.
- Every command in `.factory/claims.json` from clean clone
  `/tmp/bookmark-review6-clean.rbdmVB`.
- Every finding in reviews 1–5 against current live behavior and code.
- Titles, metadata, H1/main structure, 404 behavior, deep links, history focus,
  link crawl, mobile targets, console output, reduced motion, and axe results.

## Verification

- All 15 exact claim commands: PASS.
- `npm test`: PASS, 15/15.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Deployed Playwright suite: PASS, 36/36.
- Root and demo `verify-url.sh`: PASS with one H1/main, `lang=en`, complete image
  alternatives, labelled buttons, and zero console errors.
- Live JS/CSS hashes match the clean build.

## Remaining work

- Reopened `F-1-35`: add description, canonical, social metadata, favicon,
  apple-touch icon, and manifest to `/offline.html`; test every emitted page.
- `F-6-1`: add the common header/footer, Privacy/Terms links, factory credit,
  and build ID to `/offline.html`.
- `F-6-2`: replace the 404 footer's stale `build 1.0.0-r4` with the current
  `build 1.0.0-r5` and generate/assert one build value across all pages.

After those changes, rerun every registered claim command and the complete
deployed Playwright suite. No infrastructure, DNS, billing, or product source
was modified in this review.
