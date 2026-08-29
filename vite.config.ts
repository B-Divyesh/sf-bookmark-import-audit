import { defineConfig, type Plugin } from 'vite';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

async function filesBelow(root: string, dir = root): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesBelow(root, path) : [relative(root, path)];
  }));
  return files.flat().map((file) => {
    const normalized = file.replaceAll('\\\\', '/');
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  });
}

export function isPrecacheAsset(file: string): boolean {
  return file !== '/sw.js' && file !== '/staticwebapp.config.json';
}

function serviceWorker(): Plugin {
  return {
    name: 'versioned-service-worker',
    apply: 'build',
    async closeBundle() {
      // These are real static documents, not host-wide SPA fallbacks. That
      // keeps the app routes reloadable while unknown paths remain HTTP 404s.
      await Promise.all(['/demo', '/privacy', '/terms'].map(async (route) => {
        const destination = `dist${route}`;
        await mkdir(destination, { recursive: true });
        await copyFile('dist/index.html', `${destination}/index.html`);
      }));
      const files = (await filesBelow('dist')).filter(isPrecacheAsset);
      const template = await readFile('src/sw-template.js', 'utf8');
      const version = createHash('sha256').update(files.join('|')).digest('hex').slice(0, 10);
      await writeFile('dist/sw.js', template
        .replace('__CACHE_VERSION__', version)
        .replace('__PRECACHE_ASSETS__', JSON.stringify(files)));
    }
  };
}

export default defineConfig({
  plugins: [serviceWorker()],
  build: { target: 'es2022' },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] }
});
