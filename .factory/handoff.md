# Handoff — adversarial review 1

## Outcome

Completed an independent adversarial first-read review of the live Bookmark Import Audit at desktop and 390 px widths. The verdict is **FAIL**. No product code was changed.

The full report is `.factory/review-1.md`. Primary blockers are:

- the first-screen action is metaphorical and the sample action is below the fold;
- `/demo` is not a sandbox, and sample use overwrites the ordinary saved audit;
- `.factory/claims.json` and tagged claim tests are absent despite many live/README promises;
- the live **Buy Plus** URL returns HTTP 404;
- unknown routes return the home page with HTTP 200 instead of a designed 404.

## Verification performed

From a fresh clone of commit `544ee4e0c7ef03608fca82a47a1c9a26af391111`:

```text
npm ci             PASS — 142 packages, 0 vulnerabilities
npm test           PASS — 10/10
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS
npm run test:e2e   PASS — 8/8
```

Live checks used fresh Playwright contexts at 390 × 844 and 1440 × 900. Evidence confirmed:

- sample results appear immediately after the click;
- sample state is written to `bookmark-import-audit/state` and replaces an existing real audit;
- the offline reload/sample flow works and makes only same-origin requests;
- axe reports zero serious/critical findings at both widths;
- previous cache, security-header, service-worker, and accessible license-button repairs remain fixed;
- the checkout endpoint returns 404, while `/404` and arbitrary missing paths return the home page as 200.

## Files changed

- `.factory/review-1.md` — full verdict, findings, copy audit, claim inventory, evidence, history, and required fixes.
- `.factory/handoff.md` — this review handoff.

## Remaining work

All findings F-1-1 through F-1-49 in the review remain for the product owner/repair worker. Re-run the entire checklist from a fresh context after repair; do not accept a diff-only verification.
