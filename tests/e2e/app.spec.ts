import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { makeAuditDocument, parseBookmarkHtml } from '../../src/audit';
import { SAMPLE_BOOKMARKS } from '../../src/sample';

async function auditDemo(page: Page): Promise<void> {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Bookmark Import Audit');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
}

async function downloadText(download: Download): Promise<string> {
  const stream = await download.createReadStream();
  let output = '';
  for await (const chunk of stream!) output += chunk;
  return output;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else field += character;
  }
  fields.push(field);
  return fields;
}

function parseCsv(text: string): Record<string, string>[] {
  const [headerLine, ...lines] = text.trimEnd().split('\r\n');
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));
}

test('@claim:demo-isolation keeps a real saved audit separate from resettable demo data', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('bookmark-import-audit', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('state', 'readwrite');
      transaction.objectStore('state').put({ fileName: 'private-bookmarks.html', bookmarks: [], folders: [], result: { folderCollisions: [], duplicateClusters: [], variantClusters: [], missingTitles: [], invalidUrls: [], maxDepth: 0 }, createdAt: new Date().toISOString(), version: 1 }, 'latest');
      transaction.oncomplete = () => resolve();
    };
  }));
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Bookmark Import Audit');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name));
  expect(databases).toEqual(expect.arrayContaining(['bookmark-import-audit', 'demo:bookmark-import-audit']));
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('private-bookmarks.html')).toBeVisible();
});

test('@claim:demo-exit-discard discards edited demo data when starting for real', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#bookmark-file').setInputFiles({ name: 'demo-only.html', mimeType: 'text/html', buffer: Buffer.from('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://demo-only.example.test">Demo only</A></DL>') });
  await expect(page.getByText('demo-only.html')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/?demo=1');
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  await expect(page.getByText('demo-only.html')).not.toBeVisible();
});

test('@claim:audit-categories finds each advertised issue category in the shipped sample', async ({ page }) => {
  await auditDemo(page);
  await expect(page.getByRole('heading', { name: 'Same-named folders' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Duplicate links' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Likely URL variants' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Missing titles and malformed URLs' })).toBeVisible();
});

test('@claim:destination-profile applies only its tested folder-path rule and matching export guidance', async ({ page }) => {
  await auditDemo(page);
  const selector = page.getByLabel('Importing into');
  await expect(selector).toHaveValue('generic');
  await expect(page.getByText('Generic audit does not predict another app’s behavior.')).toBeVisible();
  await expect(page.getByText('Review paths')).toBeVisible();

  await selector.selectOption('chrome-145');
  await expect(page.getByText('Local profile 145.0.7632.6 · checked 2026-08-29')).toBeVisible();
  await expect(page.getByText('Lower risk')).toBeVisible();
  await expect(page.getByText('The local Chrome 145 fixture keeps these full folder paths separate. Confirm them after import.')).toBeVisible();
  await expect(page.getByText('Confirm both same-named folder paths after importing into Chrome 145.')).toBeVisible();

  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const rows = parseCsv(await downloadText(await pending));
  const folderRows = rows.filter((row) => row.kind === 'folder_collision');
  expect(folderRows).toHaveLength(2);
  expect(folderRows.every((row) => row.severity === 'low')).toBe(true);
  expect(folderRows.every((row) => row.suggested_action === 'Confirm both same-named folder paths after importing into Chrome 145.')).toBe(true);

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Importing into')).toHaveValue('generic');
});

test('@claim:csv-export maps every displayed issue to actionable CSV rows', async ({ page }) => {
  await auditDemo(page);
  const displayedFindings = await page.locator('.finding').evaluateAll((nodes) => nodes.map((node) => {
    const visibleUrls = [...node.querySelectorAll<HTMLElement>('small.break')].map((item) => item.innerText.trim());
    const code = node.querySelector<HTMLElement>('code')?.innerText.trim();
    const title = node.querySelector<HTMLElement>('.finding-head strong, .finding > div > strong')?.innerText.trim() ?? '';
    const paths = visibleUrls.length === 0 && !code
      ? [...node.querySelectorAll<HTMLElement>('.trace-list li')].map((item) => item.innerText.trim().replace(/\s*›\s*/g, ' / '))
      : [];
    return { references: visibleUrls.length ? visibleUrls : code ? [code] : [], title, paths };
  }));

  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const text = await downloadText(await pending);
  expect(text.split('\r\n')[0]).toBe('kind,severity,title,url,folder_path,detail,suggested_action');
  const rows = parseCsv(text);
  const sample = makeAuditDocument(SAMPLE_BOOKMARKS, 'sample-bookmark-library.html');
  const expectedRows = sample.result.folderCollisions.reduce((sum, collision) => sum + collision.paths.length, 0)
    + sample.result.duplicateClusters.reduce((sum, cluster) => sum + cluster.bookmarks.length, 0)
    + sample.result.variantClusters.reduce((sum, cluster) => sum + cluster.bookmarks.length, 0)
    + sample.result.missingTitles.length
    + sample.result.invalidUrls.length;
  expect(rows).toHaveLength(expectedRows);
  expect(rows.every((row) => row.suggested_action.trim().length > 0)).toBe(true);

  for (const finding of displayedFindings) {
    if (finding.references.length) {
      for (const reference of finding.references) {
        expect(rows.some((row) => row.url === reference || row.detail.includes(reference))).toBe(true);
      }
    } else {
      const folderTitle = finding.title.match(/“([^”]+)”/)?.[1];
      expect(folderTitle).toBeTruthy();
      for (const path of finding.paths) {
        expect(rows.some((row) => row.title === folderTitle && row.folder_path === path)).toBe(true);
      }
    }
  }
});

test('@claim:corrected-export preserves every bookmark record except the two documented repairs', async ({ page }) => {
  await auditDemo(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected HTML' }).click();
  const text = await downloadText(await pending);
  const source = parseBookmarkHtml(SAMPLE_BOOKMARKS);
  const output = parseBookmarkHtml(text);
  const repairPath = (path: string[]) => path.map((part, index) => (
    part === 'Research' && index === 1 && ['Personal', 'Work'].includes(path[0]) ? `Research — ${path[0]}` : part
  ));
  const expectedBookmarks = source.bookmarks.map((bookmark) => ({
    title: bookmark.title || new URL(bookmark.url).hostname,
    url: bookmark.url,
    folderPath: repairPath(bookmark.folderPath),
    addDate: bookmark.addDate
  }));
  const actualBookmarks = output.bookmarks.map(({ title, url, folderPath, addDate }) => ({ title, url, folderPath, addDate }));
  expect(actualBookmarks).toEqual(expectedBookmarks);
  expect(output.folders.map(({ path, title, parentPath }) => ({ path, title, parentPath }))).toEqual(
    source.folders.map((folder) => {
      const path = repairPath(folder.path);
      return { path, title: path.at(-1), parentPath: path.slice(0, -1) };
    })
  );
  expect(output.folders.filter((folder) => folder.title.includes(' — ')).map((folder) => folder.title)).toEqual([
    'Research — Personal',
    'Research — Work'
  ]);
  expect(actualBookmarks.filter((bookmark) => bookmark.title !== 'notes.example.test').map((bookmark) => bookmark.title)).toEqual(
    source.bookmarks.filter((bookmark) => bookmark.title).map((bookmark) => bookmark.title)
  );
  expect(actualBookmarks.map(({ url }) => url).sort()).toEqual(source.bookmarks.map(({ url }) => url).sort());
  await expect(page).toHaveURL(/\?demo=1$/);
  expect(text).not.toBe(SAMPLE_BOOKMARKS);
});

test('@claim:local-processing never requests a bookmark URL or third-party host', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await auditDemo(page);
  const appOrigin = new URL(page.url()).origin;
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected HTML' }).click();
  await pending;
  expect(requests.every((url) => new URL(url).origin === appOrigin)).toBe(true);
  expect(requests.join('\n')).not.toMatch(/reading\.example\.test|docs\.example\.test|redirect\.example\.test|notes\.example\.test/);
});

test('@claim:privacy-inventory has no analytics, remote scripts, remote fonts, or tracking cookies', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await auditDemo(page);
  const appOrigin = new URL(page.url()).origin;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('sample-bookmark-library.html')).toBeVisible();
  for (const name of ['Export corrected HTML', 'Export review CSV']) {
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    await pending;
  }
  const inventory = await page.evaluate(() => ({
    resources: performance.getEntriesByType('resource').map((entry) => ({
      name: entry.name,
      kind: (entry as PerformanceResourceTiming).initiatorType
    })),
    scripts: [...document.querySelectorAll<HTMLScriptElement>('script[src]')].map((script) => script.src),
    styles: [...document.styleSheets].flatMap((sheet) => sheet.href ? [sheet.href] : []),
    declaredFonts: [...document.fonts].map((font) => font.family),
    cookie: document.cookie
  }));
  const allUrls = [...requests, ...inventory.resources.map(({ name }) => name), ...inventory.scripts, ...inventory.styles];
  expect(allUrls.every((url) => new URL(url).origin === appOrigin)).toBe(true);
  const paths = allUrls.map((url) => new URL(url).pathname);
  expect(paths.every((path) => path === '/' || path === '/sw.js' || path === '/manifest.webmanifest' || path.startsWith('/assets/') || path.startsWith('/icons/'))).toBe(true);
  expect(paths.join('\n')).not.toMatch(/\/(?:analytics|collect|beacon|telemetry|tracker|tracking|pixel)(?:[/.?_-]|$)/i);
  expect(inventory.resources.filter(({ kind }) => kind === 'font')).toEqual([]);
  expect(inventory.declaredFonts).toEqual([]);
  expect(inventory.cookie).toBe('');
  expect(await page.context().cookies()).toEqual([]);
});

test('@claim:offline-reload reloads the demo and exports while offline after first visit', async ({ page, context }) => {
  await auditDemo(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  await expect(await pending).toBeTruthy();
});

test('@claim:file-size-limit validates picker and drop files at the 25 MiB boundary and recovers', async ({ page }) => {
  await page.goto('/');
  const boundary = Buffer.alloc(25 * 1024 * 1024, 32);
  boundary.write('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://size.example.test">Sized</A>');
  await page.locator('#bookmark-file').setInputFiles({ name: '25m.html', mimeType: 'text/html', buffer: boundary });
  await expect(page.getByRole('heading', { name: /issues found/i })).toBeVisible();
  await page.goto('/');
  await page.locator('#bookmark-file').setInputFiles({ name: 'too-large-picker.html', mimeType: 'text/html', buffer: Buffer.alloc(25 * 1024 * 1024 + 1, 32) });
  await expect(page.getByText('That file is over 25 MiB. Export a smaller library before auditing.')).toBeVisible();
  await page.goto('/');
  await page.locator('#drop-zone').evaluate((target, size) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(size)], 'too-large-drop.html', { type: 'text/html' }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  }, 25 * 1024 * 1024 + 1);
  await expect(page.getByText('That file is over 25 MiB. Export a smaller library before auditing.')).toBeVisible();
  await page.locator('#drop-zone').evaluate((target, html) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([html], 'recovered.html', { type: 'text/html' }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  }, '<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://recovered.example.test">Recovered</A></DL>');
  await expect(page.getByText('recovered.html')).toBeVisible();
});

test('@claim:real-audit-storage survives a refresh and can be forgotten', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bookmark-file').setInputFiles({ name: 'saved.html', mimeType: 'text/html', buffer: Buffer.from('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><A HREF="https://saved.example.test">Saved</A></DL>') });
  await expect(page.getByText('saved.html')).toBeVisible();
  await page.reload();
  await expect(page.getByText('saved.html')).toBeVisible();
  await page.getByRole('button', { name: 'Forget this audit' }).click();
  await expect(page.getByText('Four local checks')).toBeVisible();
  await page.reload();
  await expect(page.getByText('saved.html')).not.toBeVisible();
});

test('the complete primary action is visible at 1440 by 900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const action = page.getByRole('link', { name: 'Try it with sample data' }).first();
  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(900);
});

test('one click opens a populated demo at the top of the viewport', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).first().click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator('.hero')).toHaveCount(0);

  const viewportHeight = await page.evaluate(() => innerHeight);
  for (const locator of [
    page.getByText('sample-bookmark-library.html'),
    page.getByText('8', { exact: true }).first(),
    page.getByRole('heading', { name: '6 issues found in this sample' }),
    page.getByText('Same-named folders', { exact: true }).first()
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y, await locator.textContent() ?? '').toBeLessThan(viewportHeight);
    expect(box!.y + box!.height).toBeGreaterThan(0);
  }
  const exportBox = await page.getByRole('button', { name: 'Export review CSV' }).boundingBox();
  expect(exportBox).not.toBeNull();
  expect(exportBox!.y).toBeLessThanOrEqual(viewportHeight + 180);
});

test('real routes set titles, metadata, history focus, announcements, and working legal links', async ({ page, request }) => {
  const routes = [
    { path: '/', title: 'Bookmark Import Audit — check bookmark imports', canonical: 'https://bookmark-import-audit.sociobot.in/' },
    { path: '/demo', title: 'Demo — Bookmark Import Audit', canonical: 'https://bookmark-import-audit.sociobot.in/demo' },
    { path: '/privacy', title: 'Privacy — Bookmark Import Audit', canonical: 'https://bookmark-import-audit.sociobot.in/privacy' },
    { path: '/terms', title: 'Terms — Bookmark Import Audit', canonical: 'https://bookmark-import-audit.sociobot.in/terms' }
  ];
  for (const expected of routes) {
    const response = await page.goto(expected.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expected.title);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-preview\.jpg$/);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expected.title);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
  }
  for (const route of ['/privacy', '/terms']) expect((await request.get(route)).status()).toBe(200);

  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Privacy — Bookmark Import Audit');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Privacy — Bookmark Import Audit');
  await expect(page.locator('h1')).toBeFocused();
  await page.goForward();
  await expect(page).toHaveTitle('Terms — Bookmark Import Audit');
  await expect(page.locator('h1')).toBeFocused();

  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Bookmark Import Audit');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bookmark-import-audit.sociobot.in/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:designed-404 returns a metadata-complete, CSP-clean HTTP 404 with a way home', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Bookmark Import Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('That page was not found');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /not found/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bookmark-import-audit.sociobot.in/404');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Bookmark Import Audit');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Page not found — Bookmark Import Audit');
  await expect(page.locator('header nav')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Go to the audit' })).toHaveAttribute('href', '/');
  for (const route of ['/', '/privacy', '/terms']) expect((await request.get(route)).status()).toBe(200);
  expect(errors.filter((message) => !/Failed to load resource:.*status of 404\b/.test(message))).toEqual([]);
});

test('every mobile interactive target is at least 44 by 44 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/?demo=1', '/privacy', '/terms', '/offline.html', '/does-not-exist']) {
    await page.goto(route);
    const failures = await page.locator('a[href], button, input, select').evaluateAll((elements) => elements.flatMap((element) => {
      if (element instanceof HTMLInputElement && element.type === 'file') return [];
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || rect.width === 0 || rect.height === 0) return [];
      return rect.width + 0.01 < 44 || rect.height + 0.01 < 44
        ? [{ name: element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName, width: rect.width, height: rect.height }]
        : [];
    }));
    expect(failures, `${route} has undersized targets`).toEqual([]);
    const fileLabel = page.locator('label[for="bookmark-file"]');
    if (await fileLabel.count()) {
      const box = await fileLabel.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});

test('the 390px header visibly names Bookmark Import Audit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const brand = page.locator('.site-header .brand');
  await expect(brand).toBeVisible();
  await expect(brand.locator('span').last()).toHaveText('Bookmark Import Audit');
  await expect(brand.locator('span').last()).toBeVisible();
  const box = await brand.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
});

test('keyboard, reduced motion, console, links, and accessibility pass on every route', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to page content' })).toBeFocused();
  const reduced = await page.emulateMedia({ reducedMotion: 'reduce' }).then(() => page.locator('.hero picture').evaluate((element) => getComputedStyle(element).transitionDuration));
  expect(['0s', '0.00001s', '1e-05s']).toContain(reduced);

  const discovered = new Set<string>();
  const appOrigin = new URL(page.url()).origin;
  for (const route of ['/', '/demo', '/privacy', '/terms', '/offline.html', '/does-not-exist']) {
    errors.length = 0;
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors.filter((message) => !/Failed to load resource:.*status of 404\b/.test(message)), `${route} emitted console errors`).toEqual([]);
    for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))) {
      const url = new URL(href);
      if (url.origin === appOrigin && !url.hash) discovered.add(url.pathname);
    }
  }
  for (const href of discovered) expect((await request.get(href)).status(), href).toBe(200);
});
