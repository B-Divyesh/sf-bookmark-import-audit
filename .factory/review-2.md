# Adversarial first-read review 2 — Bookmark Import Audit

**Verdict: FAIL**

Reviewed 2026-08-29 against commit `3498d5469de17e83bf6301367748899222dc7bf8` and the live site in fresh Chromium contexts at 390 × 844 and 1440 × 900. Two blocking findings and one minor finding remain.

## Cold first read

Before scrolling, both viewports made the job clear: this checks a browser bookmark export for folder merges and duplicate links; it is for “people moving an old bookmark library”; click **Try it with sample data** first to see a completed audit. The 390 px first screen exposes all of that, with no horizontal overflow. The migration-console visual system is distinctive and not a generic SaaS template.

## Findings

### F-2-1 — BLOCKING — Edited demo data survives leaving demo mode

**Reopens F-1-2.**

- **Location/quote:** `/demo` banner, “Demo — sample data, nothing is saved”; **Start for real**.
- **Evidence:** In a fresh live context I loaded `/demo`, uploaded `demo-only.html` with a `demo-only.example.test` bookmark, chose **Start for real**, and returned to `/demo`. The ordinary audit correctly did not show that file, but `/demo` did show it again. IndexedDB retained `demo:bookmark-import-audit`. Source `navigate()` changes scope without deleting demo storage.
- **Why this fails:** the demo-sandbox contract requires leaving demo to discard its data or offer one explicit “keep this as my data” choice. An edited demo is retained despite the banner’s “nothing is saved” message.
- **Concrete fix:** on every demo → real transition call `forgetAudit('demo')` before rendering the real route, or offer a one-time explicit keep choice. Add `@claim:demo-exit-discard`: create a distinctive demo file, choose Start for real, return to `/demo`, and assert that only the shipped sample remains.

### F-2-2 — BLOCKING — The live 404 is neither an HTTP 404 nor CSP-clean

**Reopens F-1-34.**

- **Location/evidence:** `curl -I https://bookmark-import-audit.sociobot.in/does-not-exist`, `/404`, and `/404.html` all returned **HTTP 200**. A cold Playwright load of `/404` and `/404.html` reported two errors: “Applying inline style violates … `style-src 'self'`.” `public/404.html` contains an inline `<style>` and `style=` attribute while the deployed CSP forbids both. The static page also lacks a description, canonical, OG/Twitter metadata, favicon/manifest links, and the common header/footer.
- **Why this fails:** an unknown URL looks successful to a crawler or monitor. The designated 404 fails the no-console-errors gate and its intended design is blocked by the production CSP. The prior change added a 404 artifact but not a compliant missing-page response.
- **Concrete fix:** configure the static host so arbitrary unknown paths preserve HTTP 404 instead of being rewritten to `index.html` with 200. Move 404 styles to a same-origin stylesheet, add the route metadata/icons and consistent skeleton, and keep the home action. Test an arbitrary missing URL for status 404, no console errors, one h1/main, metadata, and the home link.

### F-2-3 — Minor — The size limit uses two different units

- **Location/quote:** upload guidance says “Files up to **25 MiB** are accepted”; the rejection says “That file is over **25 MB**.”
- **Why this matters:** these are different units. The implementation accepts `25 * 1024 * 1024` bytes, so the error is imprecise and inconsistent.
- **Concrete fix:** change the error to “That file is over 25 MiB. Export a smaller library before auditing.” Assert that exact text in `@claim:file-size-limit`.

## Copy audit

Whitespace word counts. The landing inventory includes every cold-page sentence or sentence-like label/action. No row is over 22 words; no banned marketing word, metaphor/mood heading, unexplained jargon, or non-result-naming button remains. `F-2-1` through `F-2-3` are the only flags.

### Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 3 | Bookmark import checker | Pass |
| 5 | Check bookmarks before you import | Pass |
| 14 | For people moving an old bookmark library, find folder merges and duplicate links before importing. | Pass |
| 5 | Try it with sample data | Pass |
| 5 | Audit my bookmark file | Pass |
| 4 | See a completed audit. | Pass |
| 8 | Sample data is never saved to your work. | F-2-1 |
| 5 | Processes files in your browser | Pass |
| 4 | No bookmark URL requests | Pass |
| 4 | Original file stays unchanged | Pass |
| 10 | Checks the full folder path, not only a folder name. | Pass |
| 6 | Upload a browser bookmark HTML file | Pass |
| 5 | Audit my bookmark file | Pass |
| 8 | Browsers export bookmarks in this HTML format. | Pass |
| 7 | Files up to 25 MiB are accepted. | F-2-3 |
| 3 | Choose bookmark HTML | Pass |
| 7 | or drop the file onto this tray | Pass |
| 5 | Try it with sample data | Pass |
| 3 | Four local checks | Pass |
| 2 | Folder paths | Pass |
| 5 | Same name in different places | Pass |
| 2 | Duplicate links | Pass |
| 3 | Same cleaned URL | Pass |
| 2 | URL variants | Pass |
| 5 | Possible redirect or protocol change | Pass |
| 2 | Link quality | Pass |
| 5 | Missing titles and malformed URLs | Pass |
| 4 | How the audit works | Pass |
| 7 | How the audit checks and preserves bookmarks | Pass |
| 7 | Choose the HTML export from your browser. | Pass |
| 7 | Read issues with their full folder paths. | Pass |
| 8 | Download corrected HTML and a review CSV. | Pass |
| 1 | Privacy | Pass |
| 6 | What this app does not do | Pass |
| 18 | It does not upload or open your bookmark URLs. | Pass |
| 12 | Your latest real audit is kept in this browser until you forget it. | Pass |
| 3 | Read privacy details | Pass |
| 7 | Bookmark Import Audit checks bookmark exports before import. | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 5 | Built by Param Factory | Pass |
| 2 | build 1137cb5 | Pass |

### README

| Words | Sentence or list statement | Result |
| ---: | --- | --- |
| 15 | Bookmark Import Audit checks a browser bookmark export before you move it to a new bookmark app. | Pass |
| 9 | It is for people moving an old bookmark library. | Pass |
| 8 | folders with the same name in different locations; | Pass |
| 8 | duplicate links with the same cleaned URL; | Pass |
| 14 | links that differ by http, https, www, tracking details, or a known redirect link; and | Pass |
| 5 | missing titles and malformed URLs. | Pass |
| 11 | The corrected HTML keeps every bookmark URL and full folder path. | Pass |
| 12 | It changes only folder names that may merge and blank titles. | Pass |
| 10 | The review CSV gives each issue a suggested action. | Pass |
| 7 | Files are processed in the browser. | Pass |
| 5 | Bookmark URLs are not requested. | Pass |
| 15 | The latest real audit is stored in IndexedDB until you choose Forget this audit. | Pass |
| 10 | There are no analytics, remote fonts, third-party scripts, or tracking cookies. | Pass |
| 8 | After the first visit, the app works offline. | Pass |
| 9 | Open `/demo` for a separate sample audit. | F-2-1 |
| 8 | It never reads or writes ordinary saved audits. | Pass |
| 6 | Requires Node.js 20 or newer. | Pass |
| 11 | Each visitor-facing claim is listed in `.factory/claims.json`. | Pass |
| 9 | Run every listed command from a clean checkout. | Pass |
| 11 | The build creates `dist/index.html` and the static deployment files. | Pass |
| 8 | Deploy `dist/` as a static HTTPS app. | Pass |
| 5 | The build includes `staticwebapp.config.json`. | Pass |
| 11 | It revalidates documents and caches immutable assets for one year. | Pass |
| 9 | It also sets security headers and a designed 404 response. | F-2-2 |
| 7 | `src/audit.ts` — parser, repeatable URL rules, and export functions | Pass |
| 8 | `src/storage.ts` — separate real and demo IndexedDB storage | Pass |
| 8 | `src/sw-template.js` — versioned offline cache worker | Pass |
| 6 | `.factory/demo.md` — demo isolation and reset behavior | F-2-1 |
| 6 | `.factory/claims.json` — visitor claims and their tests | Pass |
| 1 | MIT. | Pass |
| 2 | See [LICENSE](LICENSE). | Pass |

## Demo, claims, privacy, structure, and history

- `/demo` is one click away and immediately shows a realistic nested eight-bookmark, six-issue audit. The banner, Reset demo, and Start for real are present. Reset restores the sample; real storage remained untouched. F-2-1 is the remaining demo defect.
- Fresh live `/demo` traffic consisted only of same-origin HTML, JS, CSS, and image requests; no sample bookmark URL, third-party host, cookie, analytics, remote font, or tracker was seen. No AI feature is needed by this deterministic local job; corrected HTML and review CSV supply the implied export leverage.
- Every `.factory/claims.json` command passed after `npm ci`: the eight browser claims passed in desktop and 390 px projects; `delivery-config` and `license-metadata` passed in Vitest. `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` passed. Route/focus and axe cases passed separately. The split avoids the executor’s 30-second per-command output limit, not a test omission.
- `/`, `/demo`, `/privacy`, and `/terms` each had correct route titles, one h1/main, description, canonical, OG/Twitter metadata, favicon, common header/footer, and working internal links. Back navigation focused the h1. Root/demo console logs were clean; direct static 404 errors are F-2-2. Live CSP, permissions/referrer/anti-framing headers and immutable hashed-asset caching were correct.
- I read every earlier review, polish, verification, and handoff document. F-1-1, F-1-3–F-1-33, and F-1-35–F-1-49 are confirmed fixed live and in code. F-1-2 and F-1-34 are only partly fixed and are reopened above.

## What would make this perfect

Discard demo data on exit, make arbitrary missing URLs return a CSP-clean metadata-complete HTTP 404, and use MiB consistently. Add the specified regression tests. PASS requires no remaining finding.
