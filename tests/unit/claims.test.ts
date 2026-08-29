import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

describe('claim registry integrity', () => {
  it('gives every registered claim one unique tagged test', async () => {
    const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as Claim[];
    const sources = await Promise.all([
      'tests/e2e/app.spec.ts',
      'tests/unit/audit.test.ts',
      'tests/unit/staticwebapp-config.test.ts'
    ].map((file) => readFile(file, 'utf8')));
    const source = sources.join('\n');
    const marker = '@' + 'claim:';
    const ids = claims.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe('');
      expect(claim.where.trim()).not.toBe('');
      expect(claim.sandbox.trim()).not.toBe('');
      expect(claim.test).toContain(`${marker}${claim.id}`);
      expect(source.split(`${marker}${claim.id}`).length - 1).toBe(1);
    }

    const taggedIds = [...source.matchAll(new RegExp(`${marker}([a-z0-9-]+)`, 'g'))].map((match) => match[1]);
    expect(taggedIds.sort()).toEqual([...ids].sort());
  });

  it('keeps the catalog description verb-first and within 120 characters', async () => {
    const description = (await readFile('.factory/catalog-description.txt', 'utf8')).trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^(Check|Find|Review|Audit|Compare|Export)\b/);
  });
});
