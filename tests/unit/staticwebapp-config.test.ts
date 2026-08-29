import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isPrecacheAsset } from '../../vite.config';

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
  it('@claim:delivery-config keeps documents and the service worker revalidated while making static assets immutable', async () => {
    const config = await readConfig();
    const headersByRoute = new Map(config.routes.map((route) => [route.route, route.headers]));

    expect(config.globalHeaders['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/sw.js')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/manifest.webmanifest')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/assets/*')?.['Cache-Control']).toBe(immutable);
    expect(headersByRoute.get('/icons/*')?.['Cache-Control']).toBe(immutable);
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
    'sw.js',
    'manifest.webmanifest',
    'staticwebapp.config.json'
  ];
  await Promise.all(expectedFiles.map(async (file) => {
    await expect(readFile(resolve(process.cwd(), 'dist', file))).resolves.toBeInstanceOf(Buffer);
  }));

  const routeTitles = new Map([
    ['demo/index.html', 'Demo — Bookmark Import Audit'],
    ['privacy/index.html', 'Privacy — Bookmark Import Audit'],
    ['terms/index.html', 'Terms — Bookmark Import Audit']
  ]);
  await Promise.all([...routeTitles].map(async ([file, title]) => {
    const html = await readFile(resolve(process.cwd(), 'dist', file), 'utf8');
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain(`rel="canonical" href="https://bookmark-import-audit.sociobot.in/${file.split('/')[0]}"`);
  }));
});
