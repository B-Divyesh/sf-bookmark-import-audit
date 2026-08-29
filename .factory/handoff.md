# Handoff — polish 2 complete

## Outcome

All findings in `.factory/review-1.md` and `.factory/review-2.md` are closed.
The repair is `7b3d9a8` plus this handoff/build-stamp commit. It preserves the
mid-century migration-console identity and the static offline PWA deployment.

## What changed

- Demo exit now deletes the separate `demo:bookmark-import-audit` audit before
  real state loads. Reopening `/demo` always seeds the shipped sample.
- Static app routes are emitted as real documents (`/demo`, `/privacy`,
  `/terms`) instead of using a catch-all success fallback. Unknown routes now
  return HTTP 404 with a metadata-complete, CSP-clean product 404 page.
- The 404 styling is same-origin `404.css`, so the restrictive CSP emits no
  inline-style console error.
- File-limit errors now consistently say **25 MiB**. The claim registry and
  regression tests cover demo exit, 404 behavior, and exact error text.

## Verification

Fresh clone used: `/tmp/bookmark-import-audit-clean.Hdno1r` at `7b3d9a8`.

- `npm ci` — pass (142 packages, 0 vulnerabilities).
- Every command in `.factory/claims.json` — pass: 11 claim commands.
- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run build` — pass; root `dist/index.html`, real route documents, and
  service worker emitted. Initial JS: 24.73 kB / 8.93 kB gzip; CSS: 18.82 kB /
  5.23 kB gzip.
- `npm run test:e2e` — pass: 24 checks across desktop Chromium and 390 px
  Chromium, including offline reload, downloads, route focus, 404, and axe.

Deployment: `1e0297b7-af94-4ce4-a019-f933cd8a17d7` through
`/opt/fleet/lib/deploy-static.sh bookmark-import-audit dist`.

Live cold checks after deployment:

- `https://bookmark-import-audit.sociobot.in/` and `/demo` passed
  `verify-url.sh`: title, lang, one H1, main, alt text, labelled buttons, and
  zero console errors.
- `https://bookmark-import-audit.sociobot.in/does-not-exist` returned HTTP 404,
  title `Page not found — Bookmark Import Audit`, and no CSP console error.
- A fresh live context uploaded `demo-only.html`, chose Start for real, then
  reopened `/demo`: the edited file was absent and the shipped sample returned.
- Live axe at 390 px reported zero serious/critical violations on `/`, `/demo`,
  and `/does-not-exist`.

Evidence: `/tmp/bookmark-polish-2/live-root/verify.json`,
`/tmp/bookmark-polish-2/live-demo/verify.json`,
`/tmp/bookmark-polish-2/live-demo-exit.png`, and
`/tmp/bookmark-polish-2/live-not-found.png`.

## Run

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

There are no known gaps or deferred findings.
