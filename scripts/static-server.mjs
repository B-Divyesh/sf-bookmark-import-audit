import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(process.env.STATIC_ROOT ?? 'dist');
const port = Number(process.env.STATIC_PORT ?? '4173');
const config = JSON.parse(await readFile(resolve(root, 'staticwebapp.config.json'), 'utf8'));
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

function headersFor(pathname) {
  const matched = config.routes.find((route) => route.route.endsWith('/*') && pathname.startsWith(route.route.slice(0, -1)))?.headers ?? {};
  return { ...config.globalHeaders, ...matched };
}

async function fileFor(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\\/g, '/');
  const candidate = resolve(root, `.${clean}`);
  if (!candidate.startsWith(root)) return undefined;
  try {
    if ((await stat(candidate)).isDirectory()) return resolve(candidate, 'index.html');
    return candidate;
  } catch { return undefined; }
}

createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  let file = await fileFor(pathname);
  let status = 200;
  if (!file) { file = resolve(root, '404.html'); status = 404; }
  try {
    const body = await readFile(file);
    response.writeHead(status, { ...headersFor(pathname), 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch { response.writeHead(500).end('Server error'); }
}).listen(port, '127.0.0.1', () => {
  console.log(`Static server listening on ${port}`);
});
