# Bookmark Import Audit

[Bookmark Import Audit](https://bookmark-import-audit.sociobot.in) checks a
browser bookmark export before you move it to a new bookmark app. It is for
people moving an old bookmark library.

## What it checks

- folders with the same name in different locations;
- duplicate links with the same cleaned URL;
- links that differ by http, https, www, tracking details, or a known redirect
  link; and
- missing titles and malformed URLs.

The corrected HTML keeps every bookmark URL and full folder path. It changes
only folder names that may merge and blank titles. The review CSV gives each
issue a suggested action.

## Privacy and offline use

Files are processed in the browser. Bookmark URLs are not requested. The latest
real audit is stored in IndexedDB until you choose **Forget this audit**. There
are no analytics, remote fonts, third-party scripts, or tracking cookies.

After the first visit, the app works offline. Open `/demo` for a separate sample
audit. It never reads or writes ordinary saved audits.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Each visitor-facing claim is listed in `.factory/claims.json`. Run every listed
command from a clean checkout. The build creates `dist/index.html` and the
static deployment files.

## Deployment

Deploy `dist/` as a static HTTPS app. The build includes
`staticwebapp.config.json`. It revalidates documents and caches immutable
assets for one year. It also sets security headers and a designed 404 response.

## Project map

- `src/audit.ts` — parser, repeatable URL rules, and export functions
- `src/storage.ts` — separate real and demo IndexedDB storage
- `src/sw-template.js` — versioned offline cache worker
- `.factory/demo.md` — demo isolation and reset behavior
- `.factory/claims.json` — visitor claims and their tests

## License

MIT. See [LICENSE](LICENSE).
