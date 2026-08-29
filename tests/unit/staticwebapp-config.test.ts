import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isPrecacheAsset, precacheVersion } from '../../vite.config';
import { BUILD_ID } from '../../src/release';

type StaticWebAppConfig = {
  navigationFallback?: { rewrite: string; exclude: string[] };
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
  responseOverrides?: Record<string, { rewrite: string }>;
};

const configPath = resolve(process.cwd(), 'dist/staticwebapp.config.json');
const noCache = 'public, max-age=0, must-revalidate';
const immutable = 'public, max-age=31536000, immutable';

async function readConfig(): Promise<StaticWebAppConfig> {
  return JSON.parse(await readFile(configPath, 'utf8')) as StaticWebAppConfig;
}

describe('Azure Static Web Apps delivery policy', () => {
  it('@claim:delivery-config keeps documents, icons, and the service worker revalidated while making hashed build assets immutable', async () => {
    const config = await readConfig();
    const headersByRoute = new Map(config.routes.map((route) => [route.route, route.headers]));

    expect(config.globalHeaders['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/sw.js')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/manifest.webmanifest')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/assets/*')?.['Cache-Control']).toBe(immutable);
    expect(headersByRoute.has('/icons/*')).toBe(false);
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html' });
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
    await expect(readFile(resolve(process.cwd(), 'dist/demo/index.html'), 'utf8')).resolves.toContain('<title>Demo — Bookmark Import Audit</title>');
    await expect(readFile(resolve(process.cwd(), 'dist/404.html'), 'utf8')).resolves.toContain('<title>Page not found — Bookmark Import Audit</title>');
  });

  it('never precaches Azure deployment metadata that the host intentionally does not serve', () => {
    expect(isPrecacheAsset('/staticwebapp.config.json')).toBe(false);
    expect(isPrecacheAsset('/sw.js')).toBe(false);
    expect(isPrecacheAsset('/offline.html')).toBe(true);
    expect(isPrecacheAsset('/assets/index-example.js')).toBe(true);
    expect(isPrecacheAsset('/media/migration-console-800.webp')).toBe(true);
  });

  it('changes the service-worker cache version when a same-named public asset changes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'bia-cache-version-'));
    try {
      await writeFile(join(root, 'asset.txt'), 'first bytes');
      const first = await precacheVersion(root);
      await writeFile(join(root, 'asset.txt'), 'changed bytes');
      const second = await precacheVersion(root);
      expect(second.files).toEqual(first.files);
      expect(second.version).not.toBe(first.version);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('ships a restrictive same-origin response policy for local bookmark data', async () => {
    const { globalHeaders } = await readConfig();

    expect(globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(globalHeaders['Content-Security-Policy']).toContain("connect-src 'self'");
    expect(globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(globalHeaders['X-Frame-Options']).toBe('DENY');
  });
});

it('@claim:build-output creates every required static and offline artifact', async () => {
  const expectedFiles = [
    'index.html',
    'demo/index.html',
    'privacy/index.html',
    'terms/index.html',
    '404.html',
    '404.css',
    'offline.html',
    'offline.css',
    'sw.js',
    'manifest.webmanifest',
    'icons/apple-touch-icon.png',
    'media/migration-console-800.webp',
    'media/social-preview.jpg',
    'staticwebapp.config.json'
  ];
  await Promise.all(expectedFiles.map(async (file) => {
    await expect(readFile(resolve(process.cwd(), 'dist', file))).resolves.toBeInstanceOf(Buffer);
  }));

  const routeMetadata = new Map<string, [string, string]>([
    ['index.html', ['Bookmark Import Audit — check bookmark imports', 'https://bookmark-import-audit.sociobot.in/']],
    ['demo/index.html', ['Demo — Bookmark Import Audit', 'https://bookmark-import-audit.sociobot.in/demo']],
    ['privacy/index.html', ['Privacy — Bookmark Import Audit', 'https://bookmark-import-audit.sociobot.in/privacy']],
    ['terms/index.html', ['Terms — Bookmark Import Audit', 'https://bookmark-import-audit.sociobot.in/terms']],
    ['404.html', ['Page not found — Bookmark Import Audit', 'https://bookmark-import-audit.sociobot.in/404']],
    ['offline.html', ['Offline — Bookmark Import Audit', 'https://bookmark-import-audit.sociobot.in/offline.html']]
  ]);
  await Promise.all([...routeMetadata].map(async ([file, value]) => {
    const [title, canonical] = value;
    const html = await readFile(resolve(process.cwd(), 'dist', file), 'utf8');
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toMatch(/<meta name="description" content="[^"]+"/);
    expect(html).toContain(`rel="canonical" href="${canonical}"`);
    expect(html).toContain(`property="og:title" content="${title}"`);
    expect(html).toMatch(/property="og:description" content="[^"]+"/);
    expect(html).toContain('property="og:image" content="https://bookmark-import-audit.sociobot.in/media/social-preview.jpg"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain(`name="twitter:title" content="${title}"`);
    expect(html).toMatch(/name="twitter:description" content="[^"]+"/);
    expect(html).toContain('name="twitter:image" content="https://bookmark-import-audit.sociobot.in/media/social-preview.jpg"');
    expect(html).toContain('rel="icon" href="/icons/icon.svg"');
    expect(html).toContain('rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"');
    expect(html).toContain('rel="manifest" href="/manifest.webmanifest"');
  }));

  const builtScriptName = (await readdir(resolve(process.cwd(), 'dist/assets'))).find((file) => /^index-.*\.js$/.test(file));
  expect(builtScriptName).toBeDefined();
  const [index, notFound, offline, icon, sitemap, builtScript] = await Promise.all([
    readFile(resolve(process.cwd(), 'dist/index.html'), 'utf8'),
    readFile(resolve(process.cwd(), 'dist/404.html'), 'utf8'),
    readFile(resolve(process.cwd(), 'dist/offline.html'), 'utf8'),
    readFile(resolve(process.cwd(), 'dist/icons/apple-touch-icon.png')),
    readFile(resolve(process.cwd(), 'dist/sitemap.xml'), 'utf8'),
    readFile(resolve(process.cwd(), 'dist/assets', builtScriptName!), 'utf8')
  ]);
  expect(index).not.toContain('__BUILD_ID__');
  for (const document of [notFound, offline]) {
    expect(document).toContain(`build ${BUILD_ID}`);
    expect(document).not.toContain('__BUILD_ID__');
    expect(document).toContain('<header class="site-header">');
    expect(document).toContain('<footer class="site-footer">');
    expect(document).toContain('<a href="/privacy">Privacy</a>');
    expect(document).toContain('<a href="/terms">Terms</a>');
    expect(document).toContain('Built by Param Factory');
  }
  expect(builtScript).toContain(BUILD_ID);
  expect(icon.subarray(1, 4).toString()).toBe('PNG');
  expect([icon.readUInt32BE(16), icon.readUInt32BE(20)]).toEqual([180, 180]);
  expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])).toEqual([
    'https://bookmark-import-audit.sociobot.in/',
    'https://bookmark-import-audit.sociobot.in/demo',
    'https://bookmark-import-audit.sociobot.in/privacy',
    'https://bookmark-import-audit.sociobot.in/terms',
    'https://bookmark-import-audit.sociobot.in/404',
    'https://bookmark-import-audit.sociobot.in/offline.html'
  ]);
});
