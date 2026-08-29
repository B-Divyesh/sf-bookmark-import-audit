# Polish 2 — adversarial review closure

Repair commit: `7b3d9a8` (with the build stamp corrected in the handoff commit).
Local evidence is in `/tmp/bookmark-polish-2/`; live evidence was taken cold at
`https://bookmark-import-audit.sociobot.in` after deployment `399a918f-5bdc-4ca6-a9ba-73f485b7dc16`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | First screen uses direct audience wording, visible sample CTA, result note, and real-file CTA. | `routes…mobile first screen`; `/tmp/bookmark-polish-2/demo-mobile.png`; live `/` |
| F-1-2 | Added isolated `demo:` IDB, realistic sample, banner, reset/start-real; exit now deletes demo edits. | `@claim:demo-isolation`, `@claim:demo-exit-discard`; live `/demo` |
| F-1-3 | Added complete claims registry with one tagged test per claim. | every command in `.factory/claims.json` passed from clean clone |
| F-1-4 | Kept only tested local-processing wording. | `@claim:local-processing` |
| F-1-5 | Kept tested no-upload/no-bookmark-request wording. | `@claim:local-processing` |
| F-1-6 | Kept offline wording with reload/export coverage. | `@claim:offline-reload` |
| F-1-7 | Clarified original-file behavior and verified preserved URLs/paths. | `@claim:corrected-export` |
| F-1-8 | Sample asserts all four advertised issue categories. | `@claim:audit-categories` |
| F-1-9 | Uses plain folder-path wording and tests malformed URLs. | `@claim:audit-categories` |
| F-1-10 | Narrowed input claim to browser bookmark HTML. | copy audit; live `/` |
| F-1-11 | Uses 25 MiB and verifies exact boundary/rejection. | `@claim:file-size-limit` |
| F-1-12 | Replaced unproved zero-lookups language with tested local checks. | `@claim:audit-categories`, `@claim:local-processing` |
| F-1-13 | Removed subjective matching language; repeatable normalization remains unit-tested. | `tests/unit/audit.test.ts` |
| F-1-14 | Uses visible URL-difference language and no-request coverage. | `@claim:local-processing` |
| F-1-15 | Standardized full-folder-path copy and export assertions. | `@claim:corrected-export` |
| F-1-16 | Verifies tracking/fragment URLs remain in corrected HTML. | `@claim:corrected-export` |
| F-1-17 | Limits repair copy to merge-prone folder names and blank titles. | `@claim:corrected-export` |
| F-1-18 | Added CSV header and actionable-row download checks. | `@claim:csv-export` |
| F-1-19 | Verifies real persistence/forget and demo separation. | `@claim:real-audit-storage`, `@claim:demo-isolation` |
| F-1-20 | Removed license storage and broad clearing-data promise. | source/legal copy audit |
| F-1-21 | Removed unsupported Plus worksheet. | source scan; live `/` |
| F-1-22 | Removed unsupported free-tier entitlement claim. | copy audit; live `/` |
| F-1-23 | Removed unregistered price/purchase offer. | link crawl route test; live `/` |
| F-1-24 | Removed dead checkout and merchant/refund claims. | link crawl route test; live `/` |
| F-1-25 | Kept a tested local-only request/cookie/script inventory claim. | `@claim:local-processing` |
| F-1-26 | Removed license request behavior with paid feature. | source scan |
| F-1-27 | Declared Node 20 engine. | `package.json`; clean-clone `npm ci` |
| F-1-28 | Build produces root `dist/index.html` and static files. | clean-clone `npm run build` |
| F-1-29 | Replaced coverage promise with executable claim registry. | clean-clone claim run |
| F-1-30 | Emits real static route documents and preserves missing-route 404s. | route test; live `/privacy`, `/terms`, missing URL |
| F-1-31 | Retained tested static caching policy. | `@claim:delivery-config`; live headers |
| F-1-32 | Retained tested CSP/security headers. | `@claim:delivery-config`; live headers |
| F-1-33 | Retained MIT license metadata and test. | `@claim:license-metadata` |
| F-1-34 | Replaced fallback with real route files and CSP-clean HTTP 404 document. | unknown-route test; live missing URL = 404 |
| F-1-35 | Added route metadata, preview, icons, manifest. | route test; live `/`, `/demo` |
| F-1-36 | Added History API routing, focus, and announcements. | `routes, titles, focus…` test |
| F-1-37 | Added standard header/footer, method steps, and demo sitemap route. | mobile screenshot; live `/demo` |
| F-1-38 | Replaced instrument serial label with product name. | copy audit; live `/` |
| F-1-39 | Replaced mood eyebrow with product purpose. | copy audit; live `/` |
| F-1-40 | Replaced metaphor CTA with result-naming real-file action. | copy audit; live `/` |
| F-1-41 | Uses browser bookmark HTML wording. | copy audit; live `/` |
| F-1-42 | Removed repeated deterministic jargon. | copy audit |
| F-1-43 | Replaced slogan heading with useful audit heading. | copy audit |
| F-1-44 | Uses only “full folder path” for hierarchy. | copy audit; `@claim:corrected-export` |
| F-1-45 | Replaced parser terms with visible URL differences. | copy audit; `@claim:audit-categories` |
| F-1-46 | Removed unsupported paid section. | source scan; live `/` |
| F-1-47 | Standardized audit, bookmark app, issue, and folder-path terminology. | `.factory/copy-audit.md` |
| F-1-48 | Rewrote deployment documentation in short sentences. | `README.md` |
| F-1-49 | Renamed update action to Install update. | source and e2e regression suite |
| F-2-1 | Demo → real transitions (including back/forward) delete the demo audit before loading real state. | `@claim:demo-exit-discard`; `/tmp/bookmark-polish-2/live-demo-exit.png`; live `/demo` |
| F-2-2 | Removed navigation fallback; build emits route files; 404 has external CSS, metadata, icons, common skeleton. | unknown-route test; `/tmp/bookmark-polish-2/final-not-found.png`; live `/does-not-exist` = HTTP 404 |
| F-2-3 | Rejection now says 25 MiB exactly. | `@claim:file-size-limit`; live/local upload UI |

## Final checks

- Clean clone: all 11 claim commands passed, followed by lint, typecheck,
  build, and 24 Playwright checks.
- Live `/` and `/demo`: `verify-url.sh` reported one H1, main, `lang=en`, no
  missing image alt text, no unnamed buttons, and no console errors.
- Live axe at 390 px: zero serious/critical violations on `/`, `/demo`, and
  `/does-not-exist`.
- Live cold demo-exit check: edited `demo-only.html` was absent after Start for
  real and reopening `/demo`; the shipped sample was present.
