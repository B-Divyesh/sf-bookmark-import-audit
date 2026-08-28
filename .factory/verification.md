# Independent verification — candidate `0e980de7dc5d5cc72970046a219f4f6c0df467dc`

**Result: FAIL** — the product itself is functional and the live deployment is
the requested candidate, but the production response caching policy does not
meet the PWA/static-product delivery contract for immutable hashed assets.

Verified on 2026-08-28 against:

- commit: `0e980de7dc5d5cc72970046a219f4f6c0df467dc`
- URL: `https://bookmark-import-audit.sociobot.in/`
- clean checkout: `git status --short` was empty before verification
- environment: Node 22.23.2, Chromium supplied with Playwright 1.58.2

## Local gates

```text
npm ci                         PASS — 0 vulnerabilities (62 packages audited)
npm test                       PASS — 7/7 Vitest tests
npm run build                  PASS — tsc --noEmit + Vite production build
npm run test:e2e               PASS — 6/6 Playwright tests (desktop + 390×844)
```

The exact build produced `dist/`: 29.39 KB uncompressed JS (10.65 KB gzip),
17.61 KB CSS (4.99 KB gzip), 24/56 KB WebP responsive hero variants, and a
348 KB total distribution. This is within the stated JS/CSS/image budgets.
There is no separate lint script; type checking is included in `npm run build`.

Mobile Lighthouse (Chromium, local production preview) was run twice: 88 then
100 Performance, with Accessibility/Best Practices/SEO 100 both runs. The
second run reported FCP 0.9 s, LCP 1.5 s, TBT 30 ms, and CLS 0. The first
container run had anomalous 460 ms TBT despite the same 29 KB application JS;
the repeat did not reproduce it.

## Independent product exercise

- Desktop 1440 px and mobile 390×844 px: one H1 and one main landmark, no
  horizontal overflow, correct title, and no console or page errors.
- Normal path: the sample reported four review items; corrected HTML downloaded
  as `example-bookmarks-collision-safe.html` with all four source links, and
  the review CSV downloaded with nine rows including its header.
- Invalid/recovery: a non-Netscape HTML file displayed the specific export-file
  error, and a subsequent sample import completed. A 25 MiB + 1 byte upload
  was rejected with the stated size error. A valid edge file with a blank title
  and malformed URL showed both Title fallback and Repair URL findings.
- Persistence: a completed audit survived reload; confirmed “Forget this
  audit” removed it and the empty state survived another reload.
- Keyboard: the first Tab reaches “Skip to audit”; computed focus outline is
  3 px with 3 px offset and Enter moves to `#main`. Reduced motion computes to
  a 0.01 ms transition and `scroll-behavior: auto`.
- Accessibility: axe found zero serious or critical violations on both desktop
  and mobile. The live 390 px page also had zero serious/critical violations.
- Privacy/network: an unauthenticated normal audit made requests only to its
  own origin; no bookmark URL was fetched. The optional license endpoint is
  not contacted unless a license is supplied. No external font/script request
  was observed.
- PWA: after first load, offline reload still showed the app and completed the
  sample audit. The worker precaches the shell with version `bia-shell-ce1bace7f2`.
  A controlled changed-worker test produced an installed waiting worker and the
  visible “An app update is ready. Refresh” toast.

## Deployment and response checks

All 15 files in the local `dist/` build byte-match the live deployment,
including `index.html`, hashed JS/CSS, images/icons, manifest, offline page,
and service worker. Live `/`, `/privacy`, and `/terms` return 200; the SPA
renders the legal routes correctly.

Live responses include HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
and `X-Content-Type-Options: nosniff`. They do not currently include CSP,
Permissions-Policy, or an anti-framing response policy (advisory below).

## Defects

### Medium — hashed static assets are not immutable/long-lived in production

**Evidence:** live `/assets/index-DtIo7e8t.js`,
`/assets/index-DXXXBn6Z.css`, and `/icons/icon-192.png` all return:

```text
Cache-Control: public, must-revalidate, max-age=30
```

The PWA/performance acceptance contract requires long-lived immutable caching
for hashed static assets. This deployment setting forces frequent revalidation
and fails that requirement even though the service worker supplies an offline
cache. Configure the host so content-hashed assets use a long `max-age` plus
`immutable` (while retaining a short/revalidated policy for HTML and `sw.js`).

### Low — browser hardening headers are incomplete

The live response lacks `Content-Security-Policy`, `Permissions-Policy`, and
`X-Frame-Options` (or CSP `frame-ancestors`). This did not cause a functional,
privacy, or axe failure in the exercised app, but a restrictive CSP and an
anti-framing policy would reduce script-injection and clickjacking exposure for
a utility that handles sensitive bookmark exports.

## Handoff decision

Do not mark this candidate release-ready until the medium caching defect is
corrected and verified in production. No product source was changed during
this verification.
