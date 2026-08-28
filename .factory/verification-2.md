# Independent verification — candidate `362344bc1ff90c918acd2bf31e527927ff8def66`

**Result: PASS** — the repaired production PWA meets the researched brief and factory acceptance contract. No release-blocking defects were found.

Verified independently on 2026-08-28 against:

- Tested commit: `362344bc1ff90c918acd2bf31e527927ff8def66`
- Live URL: `https://bookmark-import-audit.sociobot.in/`
- Checkout: clean before testing; Node 22.23.2; Chromium from Playwright 1.58.2
- Scope: source code was not changed during verification.

## Clean-install and production gates

```text
npm ci             PASS — 142 packages installed; 0 vulnerabilities
npm test           PASS — 10/10 Vitest tests
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS — tsc --noEmit + exact Vite production build
npm run test:e2e   PASS — 8/8 Playwright tests (desktop Chromium + 390 × 844)
```

The production `dist/` is 305,093 bytes. Initial JavaScript is 29,415 bytes (10,660 gzip) and CSS is 17,609 bytes (4,990 gzip), within the static-PWA budgets. All 15 files that the host serves from the candidate build byte-match the live deployment by SHA-256; deployment-only `staticwebapp.config.json` correctly returns 404 and is not precached.

## Independent end-to-end exercise

- Desktop 1440 px and mobile 390 × 844: a realistic nested Netscape HTML file produced the expected five review items—a path collision, normalized duplicate, `www` URL variant, missing title, and malformed URL. No bookmark URL was requested.
- Invalid non-bookmark HTML produced the specific Netscape-export error; a subsequent valid import recovered. A 25 MiB + 1 byte file was rejected with the stated size error and then recovered through the sample.
- Corrected HTML disambiguated `Research — Personal` and `Research — Work` while retaining all four source links. The review CSV had the documented header and nine rows for the sample.
- An audit persisted through reload. "Forget this audit" (with confirmation) removed it and that removal persisted through the following reload.
- Keyboard-only smoke test: the first Tab reaches "Skip to audit", has a 3 px focus outline, and targets `#main`. Both viewports have no horizontal overflow. Under reduced motion, the measured transition is effectively zero (`1e-05s`).
- Axe found zero serious or critical violations on both live desktop and live 390 px pages. `/privacy` and `/terms` each render one `main` and one `h1`. No console errors or uncaught page errors occurred.

## Privacy, PWA, deployment, and response policy

- During unauthenticated local and live audits, browser traffic was limited to the product origin. There were no bookmark-URL fetches, analytics, remote fonts/scripts, tracking calls, or license-verification calls. The optional Sociobot API is only reachable through the explicitly supplied license flow.
- Fresh live 390 px context: the worker became controlling after reload; with the network disabled, reload succeeded, the offline notice appeared, and a sample audit completed. A separate temporary copy of the exact `dist/` artifact confirmed an actual changed-worker lifecycle reaches `waiting` and displays the in-app "An app update is ready" toast.
- Live `/`, `/privacy`, and `/terms` return 200. Hash-named JS/CSS and icons use `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and `sw.js` use `public, max-age=0, must-revalidate`.
- Live headers include HSTS, a restrictive `Content-Security-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a strict referrer policy.

## Performance

Live mobile Lighthouse: Performance 96, Accessibility 100, Best Practices 100, SEO 100. Measured FCP 1.0 s, LCP 1.2 s, TBT 220 ms, and CLS 0.

## Defects by severity

None found: critical 0, high 0, medium 0, low 0.
