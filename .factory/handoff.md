# Handoff — adversarial first-read review 8

## Outcome: PASS

This review added documentation only: `.factory/review-8.md`. Product code and
deployment configuration were not changed.

## What was verified

- Cold live first read at 390 × 844 and 1440 × 900: job, audience, and first
  actions are clear before scrolling.
- Live demo: populated sample in the first viewport; persistent isolation
  banner; reset and exit behavior; same-origin-only request log.
- Fresh clone `/tmp/bookmark-review8-clean.lNHKIJ`: all 16 exact claim commands
  passed, along with `npm test` (16/16), lint, typecheck, build, and local
  Playwright (40/40).
- Deployed Playwright: 40/40 across desktop and mobile, including claim flows,
  accessibility, metadata, routing, offline, and HTTP 404.
- The deployed JS, CSS, worker, manifest, offline page, and 404 page match the
  clean production build byte-for-byte.

## How to run

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

None. Keep the claim commands and live suite in the release process; no product
work is required from this review.
