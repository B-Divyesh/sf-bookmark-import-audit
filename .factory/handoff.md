# Handoff — independent verification 3

## Outcome

**FAIL — do not release candidate
`9469d87650f9375e815e2858fdd2cc493fd2d612`.**

The live deployment at <https://bookmark-import-audit.sociobot.in/> exactly
matches all 23 deployable files from the candidate build, but a mandatory claim
command fails and the PWA can retain stale stable-name assets after an
asset-only deployment. Full evidence is in `.factory/verification-3.md`.

## Blocking evidence

1. `npm run test:e2e -- --grep @claim:file-size-limit` fails under its normal
   two-project run: the 390 px project times out transferring the 25 MiB fixture.
   The local full suite repeats it (`35/36`); the live full suite fails the same
   claim in both projects (`34/36`). The acceptance contract says any failing
   registered claim command blocks release.
2. The service-worker cache version hashes filenames only, while stable-name
   images and icons are cached for one year as immutable. An independent
   asset-only update probe served new bytes but the controlled PWA retained the
   old SHA-256 and created no waiting worker.

A lower-severity copy gap remains: the first-screen facts do not mention the
tested offline capability.

## What passed

- Mandatory cold first-read and one-click populated demo.
- `npm ci`; `npm test` (15/15); lint; typecheck; exact production build.
- Fourteen of fifteen exact claim commands.
- Representative nested input, invalid-input recovery, real file-size boundary,
  both exports, saved-audit lifecycle, and 10,000-bookmark scale probe.
- Same-origin-only request log, no cookies, no bookmark URL requests, and
  expected security/cache response headers.
- Desktop and 390 px layout, keyboard export path, visible focus, reduced
  motion, route semantics, and zero serious/critical axe findings.
- Offline reload/export and the changed-worker update prompt/activation path.
- Fresh live Lighthouse: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.1 s, TBT 0 ms, CLS 0.

## Required next steps

1. Make the exact `file-size-limit` claim command reliable, preferably with
   temporary file paths or serialized large-payload projects, and rerun every
   registry command plus both full suites.
2. Fingerprint stable public assets or version the worker cache from file
   contents; do not apply immutable caching to updateable stable URLs.
3. Add a registered PWA-update claim covering a real changed asset, then update
   the README claim to match what that test proves.
4. Put the tested offline fact on the first screen.

## Reproduction

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e -- --grep @claim:file-size-limit
PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e
```

Verification changed only `.factory/verification-3.md` and this handoff; no
product source or generated runtime artifact was edited.
