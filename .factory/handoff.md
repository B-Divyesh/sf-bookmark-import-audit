# Handoff — repair 3

## Outcome

Repaired every release blocker recorded in
`.factory/verification-3.md` for candidate
`9469d87650f9375e815e2858fdd2cc493fd2d612` while preserving the local-first
bookmark audit, demo, export, route, and accessibility behavior.

## Repairs

1. **Reliable 25 MiB claim.** The file-limit browser test now creates an
   isolated temporary file for exactly 25 MiB and one for 25 MiB plus one byte.
   Each Playwright project selects a path instead of serializing a 25 MiB
   in-memory buffer over the test protocol. The picker, drop-target rejection,
   and recovery checks remain in the same registered claim.
2. **Content-versioned PWA updates.** `vite.config.ts` now hashes each
   precached path and its bytes when writing `sw.js`. Stable public artwork moved
   to `/media/` and icons now use the default revalidation policy. Only Vite's
   hashed `/assets/*` output is immutable for one year.
3. **Changed-asset update proof.** Added the registered
   `pwa-asset-update` claim. It copies the production build to an isolated
   server, installs the worker, changes the same-named public image, regenerates
   the worker, verifies the visible update prompt, installs it, and compares the
   controlled page's fetched SHA-256 to the changed bytes.
4. **First-screen offline fact.** The landing facts now state “Works offline
   after the first visit,” backed by the existing offline-reload claim.
5. **Release identity.** Build ID and manifest launch query are now
   `1.0.0-r7` / `pwa-r7`.

## Verification

Executed from a clean dependency install with Node 22 and Playwright 1.58.2:

```text
npm ci                                                    PASS — 142 packages, 0 vulnerabilities
npm run typecheck                                         PASS
npm run lint                                              PASS
npm run build                                             PASS — dist/ created
npm test                                                  PASS — 16/16
npm run test:e2e -- --grep @claim:file-size-limit         PASS — desktop + 390 px
npm run test:e2e -- --grep @claim:pwa-asset-update        PASS — desktop + 390 px
npm run test:e2e                                          PASS — 38/38 desktop + 390 px
all 16 exact commands in .factory/claims.json             PASS
```

The full browser suite includes the product flow, desktop/390 px responsive
checks, keyboard flow, reduced motion, route semantics, zero serious/critical
axe findings, same-origin-only privacy inventory, no cookies, offline reload
and export, designed HTTP 404, response-policy configuration, and the PWA
update lifecycle. The static product has 27.36 kB JavaScript (9.70 kB gzip) and
21.24 kB CSS (5.63 kB gzip), within the defined budgets.

## Deployment and live verification

The static artifact is `dist/`, with `dist/index.html` at its root. Push the
repair commit to `main`; the repository's static deployment integration should
publish it to <https://bookmark-import-audit.sociobot.in/>. After publishing,
rerun the full suite with:

```sh
PLAYWRIGHT_BASE_URL=https://bookmark-import-audit.sociobot.in npm run test:e2e
```

## Known gaps

None. The live suite and identity check are recorded after the deployment
commit is pushed.
