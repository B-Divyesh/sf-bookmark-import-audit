import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticWebAppConfig = {
  navigationFallback: { rewrite: string; exclude: string[] };
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
};

const configPath = resolve(process.cwd(), 'public/staticwebapp.config.json');
const noCache = 'public, max-age=0, must-revalidate';
const immutable = 'public, max-age=31536000, immutable';

async function readConfig(): Promise<StaticWebAppConfig> {
  return JSON.parse(await readFile(configPath, 'utf8')) as StaticWebAppConfig;
}

describe('Azure Static Web Apps delivery policy', () => {
  it('keeps documents and the service worker revalidated while making static assets immutable', async () => {
    const config = await readConfig();
    const headersByRoute = new Map(config.routes.map((route) => [route.route, route.headers]));

    expect(config.globalHeaders['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/sw.js')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/manifest.webmanifest')?.['Cache-Control']).toBe(noCache);
    expect(headersByRoute.get('/assets/*')?.['Cache-Control']).toBe(immutable);
    expect(headersByRoute.get('/icons/*')?.['Cache-Control']).toBe(immutable);
    expect(config.navigationFallback).toMatchObject({ rewrite: '/index.html' });
    expect(config.navigationFallback.exclude).toEqual(expect.arrayContaining(['/assets/*', '/icons/*']));
  });

  it('ships a restrictive same-origin response policy for local bookmark data', async () => {
    const { globalHeaders } = await readConfig();

    expect(globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
    expect(globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(globalHeaders['X-Frame-Options']).toBe('DENY');
  });
});
