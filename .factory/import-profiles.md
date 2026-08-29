# Local destination profiles

The optional destination selector defaults to **Generic audit**. Generic mode
does not predict how another bookmark app imports a file.

The bundled **Chrome 145** profile covers one rule: retaining the full folder
path when Chrome parses bookmark HTML. It is based on Chrome for Testing
`145.0.7632.6` and Chromium source revision
`47e20adcc15fc15f01825aa17e570c8f5492ac0f`. Chromium's importer represents
each imported bookmark with its parsed folder path before adding it to the
bookmark model.

Evidence is kept in:

- `tests/fixtures/import-profiles/chrome-145-input.html` — two same-named
  `Research` folders under different parents.
- `src/fixtures/chrome-145-profile.json` — the version, source revision, input
  records, and expected imported paths.
- `tests/unit/audit.test.ts` — fixture integrity and full-path checks.
- `@claim:destination-profile` — browser evidence that selecting Chrome 145
  changes only the folder-path severity and matching checklist/CSV action.

The profile does not claim to cover future Chrome versions or any other import
rule. The interface tells people to confirm the folders after import.
