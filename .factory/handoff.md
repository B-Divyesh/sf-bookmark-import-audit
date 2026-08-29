# Handoff — adversarial first-read review 4

## Outcome

Review 4 is complete at commit
`b6526a52c111a1626ec385122fa3ef6a1fb5a3f5`. The verdict in
`.factory/review-4.md` is **FAIL**: four blocking and five minor findings remain.
No product code was modified.

The blocking issues are the below-fold post-click demo, two unlisted external
importer-behavior claims, the still-192px Apple touch icon from F-1-35, and the
still-missing `/404` sitemap entry from F-1-37.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo, reset, edited-demo discard, real-audit preservation, and
  separate IndexedDB inspection.
- Complete live request log and an offline controlled reload plus CSV export.
- Every exact command in `.factory/claims.json` from clean clone
  `/tmp/bookmark-review4-clean.tL1pdW`; all 14 passed.
- `npm test` (14/14), lint, typecheck, build, and full Playwright (30/30) in the
  clean clone.
- Live metadata, title, heading, landmark, header/footer, response-header,
  internal-link, route, 404, Back/Forward, route-focus, and target-size checks.
- Live axe at mobile and desktop after populated state settled: no violations
  on root, demo, privacy, terms, or 404.
- `/opt/fleet/lib/verify-url.sh` passed root and demo with no console errors.
- Every finding from reviews 1–3 was rechecked against live behavior and code;
  the complete per-ID table is in the review.

## Evidence

- Claim result log: `/tmp/bookmark-review4-claim-results.json`
- Cold screenshots: `/tmp/review4-mobile-cold.png` and
  `/tmp/review4-desktop-cold.png`
- Demo screenshot: `/tmp/review4-live-demo-mobile.png`
- URL verification directories are listed in
  `/tmp/bookmark-review4-verify-paths`

Temporary paths are worker evidence and are not committed.

## Next steps

Implement the concrete fixes in `.factory/review-4.md`, add the specified
viewport/icon/sitemap/claim tests, deploy the repaired artifact, and run the
entire review again. Do not treat the passing registered claims or local gates
as a PASS while the blocking findings remain.
