# Bookmark Import Audit

[Bookmark Import Audit](https://bookmark-import-audit.sociobot.in) is a local,
offline-capable safety check for people moving an old browser bookmark library.
It finds import hazards before a destination manager can flatten or merge the
library’s meaning.

## What it checks

- same-named folders under different parent paths, which path-insensitive
  importers may merge;
- exact normalized URL duplicates after removing fragments, known tracking
  parameters, query-order differences, and trailing slashes;
- likely URL variants across HTTP/HTTPS, `www`, or recognizable redirect-wrapper
  parameters—reported honestly without fetching any URL;
- blank titles and malformed URLs.

The corrected Netscape HTML preserves every bookmark and nesting level. It only
disambiguates collision-prone folder labels and supplies hostname fallbacks for
blank titles. The review CSV records each finding and suggested action.

Everything above is free. The optional $9 one-time Plus license adds a locally
saved destination sign-off worksheet. Checkout and license verification use the
Sociobot billing API; no payment provider is embedded in the app.

## Privacy and offline behavior

Parsing, normalization, repair, and export happen in the browser. Bookmark URLs
are never requested. The latest audit is stored in IndexedDB so it survives a
refresh and can be explicitly forgotten. There are no analytics, third-party
scripts, remote fonts, or tracking cookies. After the first visit, the versioned
service worker serves the complete app offline.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm test
npm run build
npm run test:e2e
```

The reproducible deploy command is `npm run build`. It creates `dist/` with
`dist/index.html` at its root. End-to-end tests use Playwright 1.58.2 and cover
desktop, a 390 px viewport, offline reload, downloads, legal routing, and axe
serious/critical accessibility checks.

## Project map

- `src/audit.ts` — parser, deterministic audit logic, and HTML/CSV exports
- `src/storage.ts` — local IndexedDB state
- `src/license.ts` — one-time Sociobot license flow
- `src/sw-template.js` — generated, versioned offline cache worker
- `.factory/design.md` — visual system and original image provenance
- `.factory/handoff.md` — build verification and known limitations

## Deployment

Deploy the contents of `dist/` as a static SPA with HTTPS and route fallback to
`index.html` (so `/privacy` and `/terms` resolve directly). The build includes
`staticwebapp.config.json` for Azure Static Web Apps: HTML, the manifest, and
`sw.js` are revalidated while immutable assets are cached for one year. It also
sets the product's CSP, permissions, and anti-framing response policies.
Infrastructure, DNS, and billing product registration are handled outside this
repository by the factory.

## License

MIT. See [LICENSE](LICENSE).
