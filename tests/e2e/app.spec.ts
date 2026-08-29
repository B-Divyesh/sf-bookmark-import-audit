import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function auditDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
}

test('@claim:demo-isolation keeps a real saved audit separate from resettable demo data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('bookmark-import-audit', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const transaction = request.result.transaction('state', 'readwrite'); transaction.objectStore('state').put({ fileName: 'private-bookmarks.html', bookmarks: [], folders: [], result: { folderCollisions: [], duplicateClusters: [], variantClusters: [], missingTitles: [], invalidUrls: [], maxDepth: 0 }, createdAt: new Date().toISOString(), version: 1 }, 'latest'); transaction.oncomplete = () => resolve(); };
  }));
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Bookmark Import Audit');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('private-bookmarks.html')).toBeVisible();
});

test('@claim:demo-exit-discard discards edited demo data when starting for real', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#bookmark-file').setInputFiles({ name: 'demo-only.html', mimeType: 'text/html', buffer: Buffer.from('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://demo-only.example.test">Demo only</A></DL>') });
  await expect(page.getByText('demo-only.html')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/demo');
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  await expect(page.getByText('demo-only.html')).not.toBeVisible();
});

test('@claim:audit-categories finds each advertised issue category in the shipped sample', async ({ page }) => {
  await auditDemo(page);
  await expect(page.getByRole('heading', { name: 'Folders that may merge' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Duplicate links' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Likely URL variants' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Missing titles and malformed URLs' })).toBeVisible();
});

test('@claim:csv-export downloads an actionable CSV', async ({ page }) => {
  await auditDemo(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const text = await (await download).createReadStream().then(async (stream) => { let output = ''; for await (const chunk of stream!) output += chunk; return output; });
  expect(text.split('\r\n')[0]).toBe('kind,severity,title,url,folder_path,detail,suggested_action');
  expect(text.split('\r\n').filter(Boolean).length).toBeGreaterThan(6);
});

test('@claim:corrected-export preserves every input URL and full folder paths', async ({ page }) => {
  await auditDemo(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected HTML' }).click();
  const text = await (await download).createReadStream().then(async (stream) => { let output = ''; for await (const chunk of stream!) output += chunk; return output; });
  expect(text).toContain('https://reading.example.test/guide?utm_source=weekly#intro');
  expect(text).toContain('<H3>Research — Personal</H3>');
  expect(text).toContain('<H3>Research — Work</H3>');
  expect((text.match(/<DT><A /g) ?? []).length).toBe(8);
});

test('@claim:local-processing never requests sample bookmark URLs or a third-party host', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await auditDemo(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected HTML' }).click();
  await download;
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.join('\n')).not.toMatch(/reading\.example\.test|docs\.example\.test|redirect\.example\.test/);
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.every((script) => new URL((script as HTMLScriptElement).src).origin === location.origin))).toBe(true);
});

test('@claim:offline-reload reloads the demo and exports while offline after first visit', async ({ page, context }) => {
  await auditDemo(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  await expect(await download).toBeTruthy();
});

test('@claim:file-size-limit accepts 25 MiB and rejects a file one byte larger', async ({ page }) => {
  await page.goto('/');
  const boundary = Buffer.alloc(25 * 1024 * 1024, 32);
  boundary.write('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://size.example.test">Sized</A>');
  await page.locator('#bookmark-file').setInputFiles({ name: '25m.html', mimeType: 'text/html', buffer: boundary });
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
  await page.goto('/');
  await page.locator('#bookmark-file').setInputFiles({ name: 'too-large.html', mimeType: 'text/html', buffer: Buffer.alloc(25 * 1024 * 1024 + 1, 32) });
  await expect(page.getByText('That file is over 25 MiB. Export a smaller library before auditing.')).toBeVisible();
});

test('@claim:real-audit-storage survives a refresh and can be forgotten', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bookmark-file').setInputFiles({ name: 'saved.html', mimeType: 'text/html', buffer: Buffer.from('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://saved.example.test">Saved</A></DL>') });
  await expect(page.getByText('saved.html')).toBeVisible();
  await page.reload();
  await expect(page.getByText('saved.html')).toBeVisible();
  await page.getByRole('button', { name: 'Forget this audit' }).click();
  await expect(page.getByText('Four local checks')).toBeVisible();
});

test('routes, titles, focus announcements, and mobile first screen work', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Bookmark Import Audit');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveTitle('Terms — Bookmark Import Audit');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Privacy — Bookmark Import Audit');
  await page.goto('/demo');
  await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeVisible();
});

test('an unknown route returns a CSP-clean HTTP 404 with the common navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Bookmark Import Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('That page was not found');
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Go to the audit' })).toHaveAttribute('href', '/');
  expect(errors.filter((message) => /Content Security Policy|inline style|inline script/i.test(message))).toEqual([]);
});

test('has no serious or critical accessibility violations on demo or 404', async ({ page }) => {
  for (const route of ['/demo', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});
