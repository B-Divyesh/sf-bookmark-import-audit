# Bookmark Import Audit

[Bookmark Import Audit](https://bookmark-import-audit.sociobot.in) checks a
bookmark HTML file before you move the library to a new bookmark app. It is for
people moving an old bookmark library.

## What it checks

- folders with the same name in different locations;
- duplicate links with the same address after removing tracking details and
  anything after `#`;
- links that differ by http, https, www, tracking details, or a known redirect
  link; and
- missing titles and malformed URLs.

The corrected HTML keeps every bookmark URL and full folder path. It changes
only same-named folder labels from different paths and blank titles. The review
CSV gives each issue a suggested action.

The optional **Importing into** selector starts with Generic audit. The Chrome
145 profile uses a bundled, versioned folder-path fixture and changes only
folder severity and the matching import checklist.

## Privacy and offline use

Files are processed in the browser. Bookmark URLs are not requested. The latest
real audit stays in this browser until you choose **Forget this audit**. There
are no analytics, remote fonts, third-party scripts, or tracking cookies.

After the first visit, the app works offline. Open
[`/?demo=1`](https://bookmark-import-audit.sociobot.in/?demo=1) for a separate
sample audit. It never reads or writes ordinary saved audits. Starting for real
discards demo edits.

## Develop and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Run every command in `.factory/claims.json` from a clean checkout. The build
creates `dist/index.html`, pages for Demo, Privacy, and Terms, offline files,
and the host configuration.

## Deployment

Deploy `dist/` as a static HTTPS app. The build includes
`staticwebapp.config.json`. Browsers check pages for updates and cache uniquely
named scripts, styles, images, and icons for one year. Security headers are
included. Missing URLs show
the product’s designed 404 page and return HTTP 404.

## Project map

- `src/audit.ts` — parser, repeatable URL rules, and export functions
- `src/storage.ts` — separate real and demo IndexedDB storage
- `src/importProfiles.ts` — local destination rules and import guidance
- `src/sw-template.js` — versioned offline cache worker
- `.factory/import-profiles.md` — destination fixture scope and provenance
- `.factory/demo.md` — demo isolation and reset behavior
- `.factory/claims.json` — visitor claims and their tests

## License

MIT. See [LICENSE](LICENSE).
