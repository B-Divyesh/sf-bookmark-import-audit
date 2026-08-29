# Independent verification 4 — PASS

## Scope and identity

- Candidate: `cd800ee2902fdffce7bfafc90a178d78082e6616` on `main`
- Live URL: <https://bookmark-import-audit.sociobot.in/>
- Date: 2026-08-29

No product source files were changed during verification. The only changes in
this commit are this report and the updated handoff.

## First-read result — PASS

Opened the live landing page in a new browser context with an empty cache. It
says it **checks bookmarks before you import**, is for **people moving an old
bookmark library**, and tells the visitor to click **Try it with sample data**.
That visible first-screen action opens the populated, isolated sample audit in
one click. The plain-words and demo-sandbox gate passes.

## Clean-checkout quality gates — PASS

The checkout was clean and at the candidate SHA. A direct pre-install attempt
at every declared claim command failed only because the clean clone had no
installed dependencies (`tsc: not found`). After the required `npm ci` lockfile
install (142 packages, 0 reported vulnerabilities), every exact command in
`.factory/claims.json` passed. The 16 declared claims cover demo isolation and
exit, audit categories, destination profile, both exports, privacy inventory,
offline reload, the exact 25 MiB boundary/recovery, PWA updates, durable real
storage, delivery/build output, 404 handling, and license metadata.

Independent full runs:

```text
npm run lint                         PASS
npm test                             PASS — 16/16
npm run test:e2e                     PASS — 38/38 (desktop and 390 px projects)
npm run build                        PASS — typecheck and production dist/
PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e
                                     PASS — 38/38 against the live deployment
```

The production build emits 27.36 kB JavaScript (9.70 kB gzip) and 21.24 kB CSS
(5.63 kB gzip), within the static/PWA budgets.

## Independent product exercise — PASS

- Normal case: loaded a Netscape bookmark HTML file with a nested folder and
  normalized duplicate links; the audit reported the duplicate and exported a
  review CSV with the documented header.
- Invalid/recovery: a non-bookmark HTML file produced the actionable message
  “This does not look like a bookmark HTML file. Choose the file exported by
  your browser or bookmark app.” A valid file was then accepted in the same
  session.
- Boundary: the registered claim exercised exactly 25 MiB acceptance, 25 MiB
  plus one byte rejection through both picker and drop target, and recovery.
- Demo: `/demo` and `/?demo=1` show the persistent “Demo — sample data,
  nothing is saved” banner, Reset demo, Start for real, six sample issues, and
  both exports. The claim suite verifies the separate IndexedDB namespace and
  discard behavior.
- Offline/PWA: after the live worker controlled the page, setting the browser
  offline and reloading `?demo=1` retained “6 issues found in this sample,” the
  demo banner, and successfully exported a 2,328-byte review CSV. The registered
  PWA update claim also passed.

## Live deployment, privacy, and platform checks — PASS

- Candidate parity: 23/23 publicly served `dist` files were byte-identical to
  their live URLs (SHA-256 byte comparison). `staticwebapp.config.json` is the
  non-public deployment-control file; its live behavior was verified separately.
- A fresh remote demo/export flow requested only this origin (document, local
  JS, and local CSS), made no bookmark-URL request, used no third-party host,
  and set no cookies. There were no console errors or `pageerror` events.
- `/`, `/demo`, `/privacy`, `/terms`, `/sw.js`, the manifest, assets, media,
  and a missing URL were checked. The missing URL returned the designed page
  with HTTP 404. CSP, `nosniff`, `DENY` frame protection, strict referrer policy,
  and restrictive permissions policy were present. Hashed assets use
  `max-age=31536000, immutable`; shell, worker, manifest, and media revalidate.
- This is a static local-first app: it exposes no product server-side API and
  no sign-in/unlock flow, so rate-limit/429 and Entra-tenant checks are not
  applicable.

## Accessibility and responsive checks — PASS

`/opt/fleet/lib/verify-url.sh https://bookmark-import-audit.sociobot.in <temp>`
passed: HTTP 200, title, `lang=en`, one h1, main landmark, zero missing image
alts, zero unlabeled buttons, and zero console errors (921 ms observed load).
Independent axe Playwright analysis found zero serious or critical violations.
At 390×844 CSS px the demo had `scrollWidth === clientWidth === 390`, retained
the populated audit and banner, and had no errors. Keyboard Tab reaches the
skip link first with a visible `rgb(17, 110, 160) solid 3px` focus ring. With
reduced motion emulated, scroll behavior was `auto` and control transition
duration was effectively zero (`0.00001s`).

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Verdict

**PASS.** The candidate fulfills the researched local bookmark-import audit
job, preserves local-first/privacy behavior, supplies a genuinely one-click
isolated demo, and the current live deployment matches the tested candidate.
