# Handoff — perfection loop round 3

## Outcome

All findings from `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` are resolved. The cumulative finding-to-evidence map is
in `.factory/polish-3.md`. The mid-century migration-console identity and the
static offline PWA deployment class are unchanged.

- repair commit: `ed424f4`
- branch: `main`
- deployment: `38389d9d-f75f-47b0-8f71-ee708742cd73`
- live URL: <https://bookmark-import-audit.sociobot.in>
- direct isolated demo: <https://bookmark-import-audit.sociobot.in/?demo=1>

The first screen now places the full sample action above the 1440 × 900 fold.
The primary demo link opens `?demo=1`; its separate IndexedDB namespace,
persistent banner, reset, and start-for-real exit are verified. Mobile actions
and links are at least 44 × 44 CSS pixels. Picker and drop files share the same
25 MiB validation and recovery path.

Claims now compare observable results rather than control presence. CSV tests
map every displayed issue to parsed actionable rows. Corrected-export tests
compare every source and output URL, path, folder name, and title. Build claims
inspect `dist/`, privacy claims inventory requests/resources/fonts/scripts and
cookies, and the designed 404 has its own status/metadata claim.

## Verification evidence

Clean clone `/tmp/bookmark-polish3-clean.BOvLiz` was created from `ed424f4`.

- `npm ci`: 142 packages, 0 vulnerabilities.
- Every one of the 14 commands in `.factory/claims.json`: PASS exactly as
  listed; browser claims passed in desktop and 390 px Chromium.
- `npm test`: PASS, 14/14.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/index.html` and all route/offline/deployment
  artifacts produced.
- `npm run test:e2e`: PASS, 30/30.
- Initial JavaScript: 24.83 kB (8.88 kB gzip).
- CSS: 19.19 kB (5.27 kB gzip).

Production evidence:

- Deployed JavaScript SHA-256 equals the clean build:
  `e6ef2b49340840a927e3f1d951a9d93c1e840970945d4e44ba847063f13996fd`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles,
  descriptions, canonicals, one h1, and one main.
- `/does-not-exist` returns HTTP 404 with the designed common skeleton.
- `/opt/fleet/lib/verify-url.sh` passes `/` and `/?demo=1` with no console
  errors, missing alt text, or unnamed buttons. Reports:
  `/tmp/bookmark-polish-3/live-root/verify.json` and
  `/tmp/bookmark-polish-3/live-demo/verify.json`.
- Playwright axe integration reports zero serious or critical violations on
  root, demo, privacy, terms, and 404.
- Fresh live traffic stays on `bookmark-import-audit.sociobot.in`; no bookmark
  URL, analytics path, remote script/font, or cookie appears.
- Live demo reset and exit restore the shipped sample and preserve the real
  audit. A controlled live demo reload and CSV download work offline.
- Root HTML revalidates. Versioned JS uses
  `Cache-Control: public, max-age=31536000, immutable`; CSP, permissions,
  anti-framing, nosniff, and referrer headers are present.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. JSON:
  `/tmp/bookmark-polish-3/lighthouse-live.json`.
- Screenshots:
  `/tmp/bookmark-polish-3/live-home-desktop.png` and
  `/tmp/bookmark-polish-3/live-demo-mobile.png`.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Deploy the contents of `dist/` with the factory static work-order path.

## Known gaps and next steps

None. No finding or severity is deferred.
