import type { AuditDocument, AuditResult, Bookmark, Folder, FolderCollision, UrlCluster } from './types';

const TRACKERS = new Set([
  'fbclid', 'gclid', 'dclid', 'msclkid', 'mc_cid', 'mc_eid', 'igshid',
  'ref_src', 'ref_url', 'spm', 'yclid'
]);

function decodeEntities(value: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, entity: string) => {
    if (entity[0] === '#') {
      const hex = entity[1]?.toLowerCase() === 'x';
      const point = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : whole;
    }
    return named[entity.toLowerCase()] ?? whole;
  });
}

function textContent(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function attribute(source: string, name: string): string | undefined {
  const match = source.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  return value === undefined ? undefined : decodeEntities(value);
}

export function parseBookmarkHtml(html: string): { bookmarks: Bookmark[]; folders: Folder[] } {
  if (!/<(?:!DOCTYPE\s+NETSCAPE-Bookmark-file-1|A\b|H3\b)/i.test(html)) {
    throw new Error('This does not look like a Netscape bookmark export. Choose the HTML file exported by your browser or bookmark manager.');
  }

  const bookmarks: Bookmark[] = [];
  const folders: Folder[] = [];
  const path: string[] = [];
  const dlStack: boolean[] = [];
  let pendingFolder: string | null = null;
  const token = /<\/?DL\b[^>]*>|<H3\b([^>]*)>([\s\S]*?)<\/H3\s*>|<A\b([^>]*)>([\s\S]*?)<\/A\s*>/gi;
  let match: RegExpExecArray | null;

  while ((match = token.exec(html))) {
    const raw = match[0];
    if (/^<H3\b/i.test(raw)) {
      pendingFolder = textContent(match[2] ?? '') || 'Untitled folder';
      continue;
    }
    if (/^<A\b/i.test(raw)) {
      const url = attribute(match[3] ?? '', 'HREF')?.trim() ?? '';
      if (!url) continue;
      bookmarks.push({
        id: `b${bookmarks.length + 1}`,
        title: textContent(match[4] ?? ''),
        url,
        folderPath: [...path],
        addDate: attribute(match[3] ?? '', 'ADD_DATE')
      });
      continue;
    }
    if (/^<DL\b/i.test(raw)) {
      const entersFolder = pendingFolder !== null;
      dlStack.push(entersFolder);
      if (pendingFolder !== null) {
        path.push(pendingFolder);
        folders.push({ path: [...path], title: pendingFolder, parentPath: path.slice(0, -1) });
        pendingFolder = null;
      }
      continue;
    }
    if (/^<\/DL/i.test(raw)) {
      if (dlStack.pop()) path.pop();
    }
  }

  if (bookmarks.length === 0 && folders.length === 0) {
    throw new Error('No bookmark folders or links were found. Export bookmarks as Netscape HTML, then try that file.');
  }
  return { bookmarks, folders: uniqueFolders(folders) };
}

function uniqueFolders(folders: Folder[]): Folder[] {
  const seen = new Set<string>();
  return folders.filter((folder) => {
    const key = JSON.stringify(folder.path);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return raw.trim();
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith('utm_') || TRACKERS.has(key.toLowerCase())) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return raw.trim();
  }
}

function unwrapRedirect(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!/(?:redirect|away|out|go|link)/i.test(url.pathname)) return null;
    for (const key of ['url', 'u', 'target', 'redirect', 'dest', 'destination']) {
      const candidate = url.searchParams.get(key);
      if (candidate && /^https?:\/\//i.test(candidate)) return normalizeUrl(candidate);
    }
  } catch { /* invalid URLs are audited separately */ }
  return null;
}

function comparisonKey(raw: string): string {
  const normalized = unwrapRedirect(raw) ?? normalizeUrl(raw);
  return normalized.replace(/^https?:\/\/(?:www\.)?/i, '').replace(/\/$/, '').toLowerCase();
}

function grouped(bookmarks: Bookmark[], keyFor: (bookmark: Bookmark) => string): UrlCluster[] {
  const groups = new Map<string, Bookmark[]>();
  for (const bookmark of bookmarks) {
    const key = keyFor(bookmark);
    const list = groups.get(key) ?? [];
    list.push(bookmark);
    groups.set(key, list);
  }
  return [...groups.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([key, list]) => ({ key, bookmarks: list }))
    .sort((a, b) => b.bookmarks.length - a.bookmarks.length || a.key.localeCompare(b.key));
}

export function auditBookmarks(bookmarks: Bookmark[], folders: Folder[]): AuditResult {
  const foldersByName = new Map<string, Folder[]>();
  for (const folder of folders) {
    const key = folder.title.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
    const list = foldersByName.get(key) ?? [];
    list.push(folder);
    foldersByName.set(key, list);
  }
  const folderCollisions: FolderCollision[] = [...foldersByName.values()]
    .filter((items) => new Set(items.map((item) => JSON.stringify(item.parentPath))).size > 1)
    .map((items) => ({ title: items[0].title, paths: items.map((item) => item.path) }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const validHttp = bookmarks.filter((bookmark) => /^https?:\/\//i.test(bookmark.url));
  const duplicateClusters = grouped(validHttp, (bookmark) => normalizeUrl(bookmark.url));
  const duplicateKeys = new Set(duplicateClusters.map((cluster) => cluster.key));
  const variantClusters = grouped(validHttp, (bookmark) => comparisonKey(bookmark.url))
    .filter((cluster) => new Set(cluster.bookmarks.map((bookmark) => normalizeUrl(bookmark.url))).size > 1)
    .filter((cluster) => !duplicateKeys.has(cluster.key));

  const invalidUrls = bookmarks.filter((bookmark) => {
    try { new URL(bookmark.url); return false; } catch { return true; }
  });
  return {
    folderCollisions,
    duplicateClusters,
    variantClusters,
    missingTitles: bookmarks.filter((bookmark) => !bookmark.title.trim()),
    invalidUrls,
    maxDepth: Math.max(0, ...folders.map((folder) => folder.path.length), ...bookmarks.map((bookmark) => bookmark.folderPath.length))
  };
}

export function makeAuditDocument(html: string, fileName: string, now = new Date()): AuditDocument {
  const { bookmarks, folders } = parseBookmarkHtml(html);
  return {
    version: 1,
    createdAt: now.toISOString(),
    fileName,
    bookmarks,
    folders,
    result: auditBookmarks(bookmarks, folders)
  };
}

function htmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeFolderNames(document: AuditDocument): Map<string, string> {
  const collisionPaths = new Set(document.result.folderCollisions.flatMap((collision) => collision.paths.map((path) => JSON.stringify(path))));
  const names = new Map<string, string>();
  for (const folder of document.folders) {
    const key = JSON.stringify(folder.path);
    if (!collisionPaths.has(key)) names.set(key, folder.title);
    else names.set(key, `${folder.title} — ${folder.parentPath.length ? folder.parentPath.join(' › ') : 'root'}`);
  }
  return names;
}

interface TreeNode { path: string[]; children: Map<string, TreeNode>; bookmarks: Bookmark[] }

export function correctedBookmarkHtml(document: AuditDocument): string {
  const root: TreeNode = { path: [], children: new Map(), bookmarks: [] };
  const ensure = (path: string[]) => {
    let node = root;
    path.forEach((part, index) => {
      let child = node.children.get(part);
      if (!child) {
        child = { path: path.slice(0, index + 1), children: new Map(), bookmarks: [] };
        node.children.set(part, child);
      }
      node = child;
    });
    return node;
  };
  document.folders.forEach((folder) => ensure(folder.path));
  document.bookmarks.forEach((bookmark) => ensure(bookmark.folderPath).bookmarks.push(bookmark));
  const names = safeFolderNames(document);
  const render = (node: TreeNode, depth: number): string => {
    const indent = '    '.repeat(depth);
    const lines: string[] = [];
    for (const child of node.children.values()) {
      const title = names.get(JSON.stringify(child.path)) ?? child.path.at(-1) ?? 'Untitled folder';
      lines.push(`${indent}<DT><H3>${htmlEscape(title)}</H3>`);
      lines.push(`${indent}<DL><p>`);
      lines.push(render(child, depth + 1));
      lines.push(`${indent}</DL><p>`);
    }
    for (const bookmark of node.bookmarks) {
      let title = bookmark.title.trim();
      if (!title) {
        try { title = new URL(bookmark.url).hostname || bookmark.url; } catch { title = bookmark.url; }
      }
      const addDate = bookmark.addDate ? ` ADD_DATE="${htmlEscape(bookmark.addDate)}"` : '';
      lines.push(`${indent}<DT><A HREF="${htmlEscape(bookmark.url)}"${addDate}>${htmlEscape(title)}</A>`);
    }
    return lines.join('\n');
  };
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks — collision-safe export</TITLE>\n<H1>Bookmarks — collision-safe export</H1>\n<DL><p>\n${render(root, 1)}\n</DL><p>\n`;
}

function csv(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function reviewCsv(document: AuditDocument): string {
  const rows: (string | number)[][] = [['kind', 'severity', 'title', 'url', 'folder_path', 'detail', 'suggested_action']];
  document.result.folderCollisions.forEach((collision) => collision.paths.forEach((path) => rows.push([
    'folder_collision', 'high', collision.title, '', path.join(' / '),
    `${collision.paths.length} same-named folders occur under different parents`,
    `Use the collision-safe name: ${collision.title} — ${path.slice(0, -1).join(' › ') || 'root'}`
  ])));
  document.result.duplicateClusters.forEach((cluster) => cluster.bookmarks.forEach((bookmark) => rows.push([
    'duplicate_url', 'medium', bookmark.title || '(missing title)', bookmark.url, bookmark.folderPath.join(' / '),
    `${cluster.bookmarks.length} bookmarks normalize to ${cluster.key}`, 'Review context before removing; this export preserves every copy'
  ])));
  document.result.variantClusters.forEach((cluster) => cluster.bookmarks.forEach((bookmark) => rows.push([
    'url_variant', 'low', bookmark.title || '(missing title)', bookmark.url, bookmark.folderPath.join(' / '),
    'HTTP/HTTPS, www, or a recognizable redirect wrapper points to the same comparison key', 'Verify the destination manually; no network request was made'
  ])));
  document.result.missingTitles.forEach((bookmark) => rows.push([
    'missing_title', 'medium', '', bookmark.url, bookmark.folderPath.join(' / '), 'The bookmark has no readable title', 'The corrected HTML uses the hostname as a fallback title'
  ]));
  document.result.invalidUrls.forEach((bookmark) => rows.push([
    'invalid_url', 'high', bookmark.title || '(missing title)', bookmark.url, bookmark.folderPath.join(' / '), 'The URL could not be parsed', 'Repair or remove it in the destination manager'
  ]));
  return `${rows.map((row) => row.map(csv).join(',')).join('\r\n')}\r\n`;
}

export function repairLedger(document: AuditDocument): { before: string; after: string }[] {
  const names = safeFolderNames(document);
  return document.folders
    .filter((folder) => names.get(JSON.stringify(folder.path)) !== folder.title)
    .map((folder) => ({ before: folder.path.join(' / '), after: names.get(JSON.stringify(folder.path))! }));
}
