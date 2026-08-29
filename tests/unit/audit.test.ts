import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { auditBookmarks, correctedBookmarkHtml, makeAuditDocument, normalizeUrl, parseBookmarkHtml, reviewCsv } from '../../src/audit';
import { importProfile } from '../../src/importProfiles';
import chrome145Fixture from '../../src/fixtures/chrome-145-profile.json' with { type: 'json' };
import { SAMPLE_BOOKMARKS } from '../../src/sample';

describe('bookmark parser and audit', () => {
  it('preserves nested paths and decodes entities', () => {
    const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><H3>Work &amp; life</H3><DL><p><DT><A HREF="https://example.com?a=1&amp;b=2">A &lt;guide&gt;</A></DL><p></DL><p>`;
    const parsed = parseBookmarkHtml(html);
    expect(parsed.folders[0].path).toEqual(['Work & life']);
    expect(parsed.bookmarks[0]).toMatchObject({ title: 'A <guide>', url: 'https://example.com?a=1&b=2', folderPath: ['Work & life'] });
  });

  it('rejects files that are not bookmark HTML files', () => {
    expect(() => parseBookmarkHtml('<html><p>Hello</p></html>')).toThrow(/bookmark HTML file/);
  });

  it('normalizes tracking parameters, fragments, query order, and trailing slashes', () => {
    expect(normalizeUrl('HTTPS://Example.COM/path/?z=2&utm_source=x&a=1#part')).toBe('https://example.com/path?a=1&z=2');
  });

  it('finds path collisions, duplicates, variants, and missing titles', () => {
    const document = makeAuditDocument(SAMPLE_BOOKMARKS, 'sample.html', new Date('2026-08-28T00:00:00Z'));
    expect(document.bookmarks).toHaveLength(8);
    expect(document.result.folderCollisions).toHaveLength(1);
    expect(document.result.folderCollisions[0].paths).toEqual([['Personal', 'Research'], ['Work', 'Research']]);
    expect(document.result.duplicateClusters).toHaveLength(1);
    expect(document.result.variantClusters.length).toBeGreaterThanOrEqual(1);
    expect(document.result.missingTitles).toHaveLength(1);
    expect(document.result.maxDepth).toBe(2);
  });

  it('does not call non-http bookmarks invalid when URL parsing accepts them', () => {
    const bookmarks = [{ id: '1', title: 'Local', url: 'file:///tmp/note.html', folderPath: [] }];
    expect(auditBookmarks(bookmarks, []).invalidUrls).toEqual([]);
  });

  it('keeps the versioned Chrome 145 fixture paths distinct', async () => {
    const source = await readFile('tests/fixtures/import-profiles/chrome-145-input.html', 'utf8');
    const parsed = parseBookmarkHtml(source);
    const records = parsed.bookmarks.map(({ title, url, folderPath }) => ({ title, url: new URL(url).toString(), folderPath }));
    const profile = importProfile(chrome145Fixture.id);

    expect(chrome145Fixture.schemaVersion).toBe(1);
    expect(chrome145Fixture.sourceRevision).toMatch(/^[a-f0-9]{40}$/);
    expect(records).toEqual(chrome145Fixture.expectedImportedRecords);
    expect(new Set(records.map(({ folderPath }) => folderPath.join(' / ')))).toEqual(new Set([
      'Personal / Research',
      'Work / Research'
    ]));
    expect(profile).toMatchObject({ id: 'chrome-145', version: '145.0.7632.6' });
    expect(profile.folderCollision).toMatchObject({ severity: 'low', status: 'Lower risk' });
  });
});

describe('exports', () => {
  const document = makeAuditDocument(SAMPLE_BOOKMARKS, 'sample.html');

  it('renames colliding folder labels without removing bookmarks', () => {
    const html = correctedBookmarkHtml(document);
    expect(html).toContain('<H3>Research — Personal</H3>');
    expect(html).toContain('<H3>Research — Work</H3>');
    expect((html.match(/<DT><A /g) ?? [])).toHaveLength(document.bookmarks.length);
    expect(html).toContain('>notes.example.test</A>');
  });

  it('creates a review CSV with escaped, actionable rows', () => {
    const output = reviewCsv(document);
    expect(output).toContain('folder_collision,high,Research');
    expect(output).toContain('duplicate_url,medium');
    expect(output.split('\r\n')[0]).toBe('kind,severity,title,url,folder_path,detail,suggested_action');
  });
});

it('@claim:license-metadata ships the MIT license', async () => {
  await expect(readFile('LICENSE', 'utf8')).resolves.toMatch(/Permission is hereby granted, free of charge/);
});
