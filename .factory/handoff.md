# Handoff — adversarial review 2

## Outcome

Review-only work order. No product code was changed. The deployed product fails
this review; `.factory/review-2.md` records two blocking findings and one minor
copy finding.

## Verification performed

- Fresh live Chromium checks at 390 × 844 and 1440 × 900.
- Live demo, IndexedDB isolation, Reset, Start-for-real, request logs,
  metadata, link crawl, headers, and static/missing-404 checks.
- `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`
  passed.
- All ten commands in `.factory/claims.json` passed. Route/focus and axe tests
  also passed when invoked separately.

## Remaining work

1. Discard demo data on exit (or offer an explicit keep choice) and add the
   specified demo-exit claim test.
2. Make arbitrary missing URLs return HTTP 404. Repair the static 404 page so
   CSP permits its external styling, it has no console errors, and it has the
   required metadata and common skeleton.
3. Use `25 MiB` consistently in the rejection error and test that copy.

## Handoff note

Only this handoff and `.factory/review-2.md` were modified. The prior polish
handoff must not be treated as evidence that the two reopened live failures are
resolved.
