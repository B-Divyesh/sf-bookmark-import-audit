# Polish 1 — review finding closure

Candidate repaired from `1137cb51734b60f1e940b6c3699298db0d045499`.
Local visual evidence: `/tmp/bookmark-home-desktop.png` and
`/tmp/bookmark-demo-mobile.png`. Browser evidence names below refer to
`tests/e2e/app.spec.ts`; all ran in desktop Chromium and 390 px Chromium.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with direct audience copy, first-screen sample CTA, result note, and real-file CTA. | mobile screenshot; route test |
| F-1-2 | Added `/demo` and `?demo=1`, separate `demo:bookmark-import-audit` IDB, realistic sample, banner, reset, start-real, and docs. | `@claim:demo-isolation`; demo screenshot |
| F-1-3 | Added the required claim registry and one unique tagged test per retained claim. | `.factory/claims.json`; all listed commands pass |
| F-1-4 | Kept only local processing wording and tested the complete request log. | `@claim:local-processing` |
| F-1-5 | Replaced broad privacy copy with the observable no-upload/no-bookmark-request promise. | `@claim:local-processing` |
| F-1-6 | Retained the offline promise with a reload-and-export test. | `@claim:offline-reload` |
| F-1-7 | Rewrote the original-file copy and asserted URLs and folder paths in export. | `@claim:corrected-export` |
| F-1-8 | Shipped a realistic fixture and asserted all four advertised categories. | `@claim:audit-categories` |
| F-1-9 | Rewrote folder-path language and included malformed URL coverage in the fixture. | `@claim:audit-categories` |
| F-1-10 | Narrowed input copy to browser bookmark HTML files. | mobile screenshot; copy audit |
| F-1-11 | Defined the limit as 25 MiB and tested exact boundary acceptance plus one-byte rejection. | `@claim:file-size-limit` |
| F-1-12 | Replaced unsupported “zero” wording with tested local checks. | `@claim:audit-categories`, `@claim:local-processing` |
| F-1-13 | Replaced “safe deterministic” copy with “same cleaned URL”; repeatable unit normalization remains covered. | `tests/unit/audit.test.ts` |
| F-1-14 | Rewrote implementation terms as visible URL differences and tested request isolation. | `@claim:local-processing` |
| F-1-15 | Standardized “full folder path” and asserted both exported paths. | `@claim:corrected-export` |
| F-1-16 | Asserted an original URL with tracking and fragment remains in corrected HTML. | `@claim:corrected-export` |
| F-1-17 | Rewrote repair copy as folder names that may merge and blank titles; ledger remains visible. | `@claim:corrected-export` |
| F-1-18 | Added downloaded CSV header and actionable-row assertions. | `@claim:csv-export` |
| F-1-19 | Added real audit persistence/forget coverage and demo isolation. | `@claim:real-audit-storage`, `@claim:demo-isolation` |
| F-1-20 | Removed license storage and the broad clearing-data promise with the paid feature. | source and legal copy audit |
| F-1-21 | Removed unsupported Plus worksheet and its claim. | no Plus UI or storage code |
| F-1-22 | Removed unsupported free-tier entitlement wording. | landing and README copy audit |
| F-1-23 | Removed unregistered price and purchase offer. | no checkout link |
| F-1-24 | Removed the dead checkout, merchant, and refund assertions. | link crawl route test |
| F-1-25 | Kept a tested local-only inventory claim; test checks requests, cookies, and scripts. | `@claim:local-processing` |
| F-1-26 | Removed optional license network behavior with paid licensing. | no license code is imported |
| F-1-27 | Added `engines.node: >=20`. | `package.json` |
| F-1-28 | Kept the build artifact statement and verified `npm run build`. | build output: `dist/index.html` |
| F-1-29 | Replaced the untestable coverage list with concrete commands and claim registry. | README and claim suite |
| F-1-30 | Added static routes, sitemap entries, a designed 404 artifact, and Azure 404 override. | route test; config unit test |
| F-1-31 | Registered and tested static cache configuration. | `@claim:delivery-config` |
| F-1-32 | Registered and tested CSP, permissions, and anti-framing configuration. | `@claim:delivery-config` |
| F-1-33 | Registered and tested the MIT license metadata. | `@claim:license-metadata` |
| F-1-34 | Added `404.html`, SPA 404 state, and `responseOverrides.404`. | route test; config unit test |
| F-1-35 | Added canonical, OG/Twitter metadata, 1200×630 product preview, and apple-touch icon. | `index.html`; `social-preview.jpg` |
| F-1-36 | Added History API navigation, popstate, focused H1, and polite route announcement. | route test |
| F-1-37 | Added three-step how-it-works, factory/build footer, and demo sitemap route. | mobile screenshot; sitemap |
| F-1-38 | Replaced “Field instrument 01” with the product name. | desktop screenshot |
| F-1-39 | Replaced mood eyebrow with “Bookmark import checker”. | desktop screenshot |
| F-1-40 | Replaced metaphorical CTA with “Audit my bookmark file”. | mobile screenshot |
| F-1-41 | Replaced legacy-format lead label with browser bookmark HTML wording. | mobile screenshot |
| F-1-42 | Replaced repeated deterministic jargon with user-visible URL matching rules. | copy audit |
| F-1-43 | Replaced slogan heading with “How the audit checks and preserves bookmarks”. | mobile screenshot |
| F-1-44 | Standardized the hierarchy term to “full folder path”. | copy audit; corrected export claim |
| F-1-45 | Replaced parser terminology with protocol, www, tracking, and redirect-link wording. | mobile screenshot |
| F-1-46 | Removed unsupported paid section. | source and screenshot |
| F-1-47 | Standardized audit, bookmark app, issues, and full folder path. | `.factory/copy-audit.md` |
| F-1-48 | Rewrote deployment documentation as short sentences. | README |
| F-1-49 | Renamed update action to “Install update”. | `src/main.ts` |

No findings are deferred. Live deployment verification is recorded in the
handoff after the work-order deployment completes.
