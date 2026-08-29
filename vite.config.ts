import { defineConfig, type Plugin } from 'vite';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { BUILD_ID } from './src/release';

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

const routeMetadata = {
  '/demo': {
    title: 'Demo — Bookmark Import Audit',
    description: 'Try a completed sample bookmark audit. Demo changes never replace your saved audit.'
  },
  '/privacy': {
    title: 'Privacy — Bookmark Import Audit',
    description: 'How Bookmark Import Audit processes and stores bookmark audits locally in your browser.'
  },
  '/terms': {
    title: 'Terms — Bookmark Import Audit',
    description: 'Terms for using Bookmark Import Audit, a local bookmark HTML file checker.'
  }
} as const;

function routeDocument(source: string, route: keyof typeof routeMetadata): string {
  const { title, description } = routeMetadata[route];
  const canonical = `https://bookmark-import-audit.sociobot.in${route}`;
  return source
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${description}$2`);
}

function serviceWorker(): Plugin {
  return {
    name: 'versioned-service-worker',
    apply: 'build',
    async closeBundle() {
      // These are real static documents, not host-wide SPA fallbacks. That
      // keeps the app routes reloadable while unknown paths remain HTTP 404s.
      const indexDocument = await readFile('dist/index.html', 'utf8');
      await Promise.all((Object.keys(routeMetadata) as Array<keyof typeof routeMetadata>).map(async (route) => {
        const destination = `dist${route}`;
        await mkdir(destination, { recursive: true });
        await writeFile(`${destination}/index.html`, routeDocument(indexDocument, route));
      }));
      await Promise.all(['404.html', 'offline.html'].map(async (file) => {
        const path = join('dist', file);
        const document = await readFile(path, 'utf8');
        await writeFile(path, document.replaceAll('__BUILD_ID__', BUILD_ID));
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
