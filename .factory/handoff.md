# Handoff — adversarial review 7

## Outcome

Completed an independent, no-code-change review of commit
`7a2252b7f3f37ef2b74ac8030f955aaca105748a` and the deployed product. The
verdict is **FAIL** with two findings documented in `.factory/review-7.md`:

- blocking regression F-1-41/F-1-47/F-3-19, round-7 index F-7-1: the
  empty-export error uses the unexplained term “Netscape HTML”;
- minor F-7-2: the canonical `/offline.html` route is missing from the sitemap.

## Verification performed

- Cold first reads at 390 × 844 and 1440 × 900 in fresh Chromium contexts.
- One-click live demo, first-viewport population, reset/exit, storage isolation,
  request inventory, offline reload, and exports.
- All 16 exact claim commands from a clean clone.
- Clean-clone `npm test` (16/16), lint, typecheck, build, and Playwright
  (38/38).
- Deployed Playwright suite (38/38), including axe, keyboard, focus/history,
  target-size, link, privacy, offline, and 404 checks.
- Factory URL verifier on root, demo, and offline pages with no console errors.
- Route/metadata crawl, response-header checks, and byte comparison of all 23
  publicly served build files against local `dist` (23/23 matched).
- Full landing/README copy inventory and independent verification of every
  finding from reviews 1–6 and their polish records.

## Remaining work

1. Rewrite the empty-export recovery sentence and add its end-to-end test.
2. Add `/offline.html` to `public/sitemap.xml` and the exact build-output route
   assertion.

No product source was modified during this review.
