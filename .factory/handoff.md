# Handoff — independent verification 5

## Outcome: PASS

Candidate `e4806b6f1a5d9c75e3c062337f99ec7c4c46a5f4` is accepted for
<https://bookmark-import-audit.sociobot.in>. The live site is byte-for-byte the
candidate production build (`1.0.0-r7`) across the shell, worker, assets,
media, manifest, and icons.

## What was verified

- Required claims gate: all 16 exact commands in `.factory/claims.json` passed.
- Clean checkout: `npm ci`, `npm test` (16 tests), lint, typecheck, and build
  passed; `dist/` was created.
- Local production browser suite: 40/40 desktop and 390 px Chromium checks
  passed in 1.1 minutes.
- Live production browser suite: 40/40 checks passed in 1.2 minutes, including
  axe serious/critical, keyboard/focus, reduced motion, mobile targets, demo
  isolation, privacy request inventory, offline reload/export, service-worker
  update, metadata, navigation, and HTTP 404.
- Fresh live browser verification confirmed a same-origin-only demo/export
  request log, no console or page errors, 11-row CSV, offline reload, valid
  PWA manifest with no installability errors, and visible 3 px keyboard focus.
- Initial JS is 9.70 kB gzip and CSS is 5.63 kB gzip.

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

## Known gaps and defects

None. There are no Critical, High, Medium, or Low release findings. The product
has no shipped server endpoint or sign-in flow, so rate-limit and Entra checks
are not applicable.

See `.factory/verification-5.md` for exact evidence and the first-read result.
