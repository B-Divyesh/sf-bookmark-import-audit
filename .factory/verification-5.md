# Independent verification 5 — PASS

**Candidate:** `e4806b6f1a5d9c75e3c062337f99ec7c4c46a5f4`  
**Verified URL:** <https://bookmark-import-audit.sociobot.in>  
**Date:** 2026-08-29  
**Method:** clean-checkout install, exact claims gate, local production suite, and fresh live-browser verification.

## Release verdict

**PASS.** The live site serves the candidate build (`1.0.0-r7`) and satisfies the researched brief's local bookmark-import audit job. No Critical, High, Medium, or Low defects were found.

## Mandatory first checks

### Claims gate

`.factory/claims.json` exists and contains 16 claims. After `npm ci` (142 packages installed; 0 reported vulnerabilities), every listed command was run exactly and passed:

| Claim IDs | Exact command | Result |
| --- | --- | --- |
| `demo-isolation`, `demo-exit-discard`, `audit-categories`, `destination-profile`, `csv-export`, `corrected-export`, `local-processing`, `privacy-inventory`, `offline-reload`, `file-size-limit`, `pwa-asset-update`, `real-audit-storage`, `designed-404` | `npm run test:e2e -- --grep @claim:<id>` | PASS; each ran in both configured Chromium projects |
| `delivery-config`, `build-output`, `license-metadata` | `npm test -- -t @claim:<id>` | PASS |

The claims cover the required demo isolation/reset, four audit categories, destination guidance, both export formats, privacy/no-third-party requests, 25 MiB recovery boundary, durable real storage, offline reload, worker update, security delivery configuration, output routes, styled 404, and MIT license.

### Cold first-read test (live, new browser context)

The first screen plainly says: **“Check bookmarks before you import.”** It says it is for people moving an old bookmark library and that it finds same-named folders and duplicate links before import. The first action is **“Try it with sample data”**; adjacent copy says it opens a completed audit and demo changes never replace a saved audit. The action is one click, and `/?demo=1` opens the populated, persistent demo banner. This passes the plain-words and demo-sandbox gate.

## Clean local verification

| Check | Result / evidence |
| --- | --- |
| `npm ci` | PASS; 142 packages, 0 vulnerabilities reported |
| `npm test` | PASS; 3 files, 16 tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; produced `dist/` |
| `npm run test:e2e` | PASS; 40 tests, desktop Chromium + 390 × 844 Chromium, 1.1 min |

The production build emits 27.37 kB raw / 9.70 kB gzip JS and 21.24 kB raw / 5.63 kB gzip CSS, within the static-PWA budgets.

## Live deployment verification

`PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e` passed **40/40** in 1.2 minutes. This includes the Playwright axe serious/critical scan, keyboard and visible focus checks, reduced-motion behavior, 390 px targets/overflow, demo flow, real-file persistence/forget, invalid and boundary-file recovery, routes/metadata/history, worker update behavior, offline reload/export, response status, and styled HTTP 404.

Independent live-browser checks additionally found:

- Demo export created CSV header `kind,severity,title,url,folder_path,detail,suggested_action` with 11 review rows.
- Offline reload after a controlled service-worker first visit retained the demo banner and findings.
- A new request log over demo, export, reload, and offline flow contained only same-origin document, script, stylesheet, and manifest requests; no bookmark URL, analytics, remote font, tracking, or third-party request occurred. Console and page errors: none.
- Keyboard Tab starts at the skip link; it had a visible `3px solid rgb(17, 110, 160)` focus outline. The 390 px demo had scroll width 390, showed the banner and populated result, and was visually reviewed alongside desktop.
- Chrome DevTools `Page.getAppManifest` parsed the manifest with no errors; `Page.getInstallabilityErrors` returned an empty array.
- `/`, `/demo`, `/privacy`, `/terms`, and `/offline.html` returned 200; an arbitrary missing URL returned 404.
- The live root carried the expected CSP, HSTS, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, and `Permissions-Policy`. Hashed JS/CSS used `public, max-age=31536000, immutable`; the worker revalidates.

## Candidate/live identity

The local candidate and live deployment share build ID `1.0.0-r7`. Byte-for-byte SHA-256 comparisons matched for `index.html`, 404/offline documents, manifest, robots, sitemap, worker, hashed JS/CSS, all shipped hero/social media, and all application icons. The live deployment is therefore the tested candidate, not an earlier build.

The shipped bundle has no server-side product endpoint or Sociobot license call, and no sign-in flow; rate-limit and Entra-tenant checks are not applicable.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Handoff

The product is ready for release. Re-run with:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e
```
