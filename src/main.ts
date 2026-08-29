import './styles.css';
import { correctedBookmarkHtml, makeAuditDocument, repairLedger, reviewCsv } from './audit';
import { IMPORT_PROFILES, importProfile } from './importProfiles';
import { SAMPLE_BOOKMARKS } from './sample';
import { forgetAudit, loadAudit, saveAudit, type StorageScope } from './storage';
import type { AuditDocument, Bookmark, FolderCollision, UrlCluster } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const knownRoutes = new Set(['/', '/demo', '/privacy', '/terms', '/404']);
let audit: AuditDocument | undefined;
let scope: StorageScope = location.pathname === '/demo' || new URLSearchParams(location.search).has('demo') ? 'demo' : 'real';

const esc = (value: string | number) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageMeta: Record<string, [string, string]> = {
  '/': ['Bookmark Import Audit — check bookmark imports', 'Check a bookmark HTML file for same-named folders, duplicate links, URL variants, and missing titles before importing.'],
  '/demo': ['Demo — Bookmark Import Audit', 'Try a completed sample bookmark audit. Demo changes never replace your saved audit.'],
  '/privacy': ['Privacy — Bookmark Import Audit', 'How Bookmark Import Audit processes and stores bookmark audits locally in your browser.'],
  '/terms': ['Terms — Bookmark Import Audit', 'Terms for using Bookmark Import Audit, a local bookmark HTML file checker.'],
  '/404': ['Page not found — Bookmark Import Audit', 'The requested Bookmark Import Audit page was not found.']
};

function route(): string { return knownRoutes.has(location.pathname.replace(/\/$/, '') || '/') ? (location.pathname.replace(/\/$/, '') || '/') : '/404'; }
function setMeta(path: string): void {
  const [title, description] = pageMeta[path];
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://bookmark-import-audit.sociobot.in${path === '/' ? '/' : path}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
}
function header(active = route()): string {
  return `<header class="site-header"><a class="brand" href="/" data-route aria-label="Bookmark Import Audit home"><span class="brand-mark" aria-hidden="true">BIA</span><span>Bookmark Import Audit</span></a><nav aria-label="Site"><a href="/" data-route ${active === '/' ? 'aria-current="page"' : ''}>Audit</a><a href="/demo" data-route ${active === '/demo' ? 'aria-current="page"' : ''}>Demo</a><a href="/privacy" data-route ${active === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a></nav></header>`;
}
function footer(): string { return `<footer><p><strong>Bookmark Import Audit</strong> checks bookmark HTML files before import.</p><div class="footer-meta"><nav aria-label="Legal"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a></nav><span>Built by Param Factory</span><span>build 1.0.0-r5</span></div></footer>`; }
function demoBanner(): string { return scope === 'demo' ? `<aside class="demo-banner" aria-label="Demo controls"><strong>Demo — sample data, nothing is saved</strong><span><button class="link-button" id="reset-demo">Reset demo</button><a href="/" data-route>Start for real</a></span></aside>` : ''; }
function pathLabel(path: string[]): string { return path.length ? path.map(esc).join('<span aria-hidden="true"> › </span>') : '<em>Top level</em>'; }
function clusterMarkup(cluster: UrlCluster, type: 'duplicate' | 'variant'): string { return `<li class="finding"><div class="finding-head"><span class="status ${type === 'duplicate' ? 'warn' : 'info'}">${type === 'duplicate' ? 'Review copies' : 'Verify target'}</span><strong>${cluster.bookmarks.length} links</strong></div><code>${esc(cluster.key)}</code><ul class="trace-list">${cluster.bookmarks.map((bookmark) => `<li><span>${esc(bookmark.title || '(missing title)')}</span><small>${pathLabel(bookmark.folderPath)}</small><small class="break">${esc(bookmark.url)}</small></li>`).join('')}</ul></li>`; }
function collisionMarkup(collision: FolderCollision, profileId?: string): string {
  const guidance = importProfile(profileId).folderCollision;
  return `<li class="finding"><div class="finding-head"><span class="status ${guidance.tone}">${guidance.status}</span><strong>“${esc(collision.title)}” appears in ${collision.paths.length} folders</strong></div><ul class="trace-list">${collision.paths.map((path) => `<li>${pathLabel(path)}</li>`).join('')}</ul></li>`;
}
function missingMarkup(bookmark: Bookmark, invalid = false): string { return `<li class="finding compact"><span class="status ${invalid ? 'danger' : 'warn'}">${invalid ? 'Repair URL' : 'Title fallback'}</span><div><strong>${esc(bookmark.title || '(missing title)')}</strong><small>${pathLabel(bookmark.folderPath)}</small><code>${esc(bookmark.url)}</code></div></li>`; }
function profileMarkup(document: AuditDocument): string {
  const selected = importProfile(document.importProfileId);
  const options = IMPORT_PROFILES.map((profile) => `<option value="${profile.id}" ${profile.id === selected.id ? 'selected' : ''}>${esc(profile.label)}</option>`).join('');
  const note = selected.id === 'generic'
    ? 'Generic audit does not predict another app’s behavior.'
    : `Local profile ${esc(selected.version)} · checked ${esc(selected.verifiedOn ?? '')}`;
  return `<div class="profile-control"><label for="import-profile">Importing into</label><select id="import-profile" aria-describedby="profile-note">${options}</select><p id="profile-note">${note}</p></div>`;
}
function exportButtons(includeForget = true): string {
  return `<div class="export-actions"><button class="button primary" id="export-html">Export corrected HTML</button><button class="button secondary" id="export-csv">Export review CSV</button>${includeForget ? '<button class="button quiet" id="forget-audit">Forget this audit</button>' : ''}</div>`;
}
function resultMarkup(document: AuditDocument, demo = false): string {
  const { result } = document;
  const profile = importProfile(document.importProfileId);
  const count = result.folderCollisions.length + result.duplicateClusters.length + result.variantClusters.length + result.missingTitles.length + result.invalidUrls.length;
  const ledger = repairLedger(document);
  const heading = demo
    ? `<h1 id="result-title">${count} issues found in this sample</h1>`
    : `<h2 id="result-title">${count} issues found</h2>`;
  const quickSummary = demo ? `<ul class="demo-categories" aria-label="Finding categories"><li>Same-named folders</li><li>Duplicate links</li><li>URL variants</li><li>Missing titles or malformed URLs</li></ul><div class="demo-quick-actions">${exportButtons(false)}</div><h2 class="sr-only">Detailed findings</h2>` : '';
  return `<section class="results reveal ${demo ? 'demo-results' : ''}" aria-labelledby="result-title"><div class="result-header"><div><p class="eyebrow">${demo ? 'Completed sample audit' : 'Audit complete'}</p>${heading}<p>${esc(document.fileName)} · checked locally</p></div><span class="seal review">Review</span></div><div class="gauges" aria-label="Audit counts"><div><span>${document.bookmarks.length}</span><b>Bookmarks</b></div><div><span>${document.folders.length}</span><b>Folders</b></div><div><span>${result.maxDepth}</span><b>Levels deep</b></div><div><span>${count}</span><b>Issues</b></div></div>${profileMarkup(document)}${quickSummary}${result.folderCollisions.length ? `<section class="finding-section"><div class="section-number">01</div><div><h3>Same-named folders</h3><p>${profile.folderCollision.explanation} These full folder paths stay separate in the corrected copy.</p><ol class="finding-list">${result.folderCollisions.map((collision) => collisionMarkup(collision, profile.id)).join('')}</ol></div></section>` : ''}${result.duplicateClusters.length ? `<section class="finding-section"><div class="section-number">02</div><div><h3>Duplicate links</h3><p>Links are grouped after removing tracking details and anything after #. Every original link stays in the corrected copy.</p><ol class="finding-list">${result.duplicateClusters.map((cluster) => clusterMarkup(cluster, 'duplicate')).join('')}</ol></div></section>` : ''}${result.variantClusters.length ? `<section class="finding-section"><div class="section-number">03</div><div><h3>Likely URL variants</h3><p>These differ by http, https, www, or a known redirect link. Verify them manually.</p><ol class="finding-list">${result.variantClusters.map((cluster) => clusterMarkup(cluster, 'variant')).join('')}</ol></div></section>` : ''}${result.missingTitles.length || result.invalidUrls.length ? `<section class="finding-section"><div class="section-number">04</div><div><h3>Missing titles and malformed URLs</h3><p>Blank titles get a hostname fallback. Malformed URLs remain visible for repair.</p><ul class="finding-list">${result.missingTitles.map((b) => missingMarkup(b)).join('')}${result.invalidUrls.map((b) => missingMarkup(b, true)).join('')}</ul></div></section>` : ''}<section class="repair-section"><div><p class="eyebrow">Corrected copy</p><h3>Export a corrected copy</h3><p>The download is separate. It changes only same-named folder labels from different paths and fills blank titles.</p></div><div class="import-checklist"><strong>Before you import</strong><p>${esc(profile.folderCollision.checklist)}</p></div>${ledger.length ? `<div class="ledger"><table><thead><tr><th>Original folder</th><th>Exported folder</th></tr></thead><tbody>${ledger.map((item) => `<tr><td data-label="Original">${esc(item.before)}</td><td data-label="Exported">${esc(item.after)}</td></tr>`).join('')}</tbody></table></div>` : ''}${demo ? '' : exportButtons()}</section></section>`;
}
function uploadMarkup(): string { return `<section class="bench" id="audit-bench" aria-labelledby="bench-title"><div class="bench-intro"><p class="eyebrow">Upload a bookmark HTML file</p><h2 id="bench-title">Audit my bookmark HTML file</h2><p>Choose the bookmark HTML file you exported from your browser. Files up to 25 MiB are accepted.</p></div><div class="file-well" id="drop-zone"><input id="bookmark-file" type="file" accept=".html,.htm,text/html"><label for="bookmark-file"><span class="input-icon" aria-hidden="true"><i></i><i></i><i></i></span><strong>Choose bookmark HTML file</strong><small>or drop the file onto this tray</small></label>${scope === 'demo' ? '' : '<a class="sample-button" href="/?demo=1" data-route>Try it with sample data</a>'}</div><div id="audit-status" class="audit-status" role="status" aria-live="polite"></div></section>`; }
function methodMarkup(): string { return `<section class="method" aria-labelledby="method-title"><div><p class="eyebrow">How the audit works</p><h2 id="method-title">How the audit checks and preserves bookmarks</h2></div><div class="method-grid"><p><b>Upload</b>Choose the bookmark HTML file from your browser.</p><p><b>Review</b>Read issues with their full folder paths.</p><p><b>Export</b>Download corrected HTML and a review CSV.</p></div></section>`; }
function privacyMarkup(): string { return `<section class="privacy-section" aria-labelledby="privacy-title"><p class="eyebrow">Privacy</p><h2 id="privacy-title">How the app protects your bookmark data</h2><p>It does not upload or open your bookmark URLs. Your latest real audit is kept in this browser until you forget it.</p><a href="/privacy" data-route>Read privacy details</a></section>`; }
function toastMarkup(): string { return `<div id="offline-notice" class="toast" role="status" hidden><span>Offline: the audit still works.</span></div><div id="update-toast" class="toast update" role="status" hidden><span>An app update is ready.</span><button type="button" id="refresh-app">Install update</button></div>`; }
function homePage(): void {
  const isDemo = scope === 'demo';
  if (isDemo) {
    app.innerHTML = `${header('/demo')}<main id="main" class="demo-main">${demoBanner()}${audit ? resultMarkup(audit, true) : ''}${uploadMarkup()}${privacyMarkup()}${toastMarkup()}</main>${footer()}`;
  } else {
    app.innerHTML = `${header('/')}<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="lamp" aria-hidden="true"></span> Bookmark import checker</p><h1>Check bookmarks before you import</h1><p class="lede">For people moving an old bookmark library, find same-named folders and duplicate links before importing.</p><div class="hero-actions"><a class="button primary" href="/?demo=1" data-route>Try it with sample data</a><a class="button secondary" href="#audit-bench">Audit my bookmark HTML file</a></div><p class="action-note">See a completed audit. Demo changes never replace your saved audit.</p><ul class="trust-list"><li>Processes files in your browser</li><li>No bookmark URL requests</li><li>Downloads a separate corrected copy</li></ul></div><figure><picture><source type="image/webp" srcset="/assets/migration-console-800.webp 800w, /assets/migration-console-1400.webp 1400w" sizes="(max-width: 800px) 92vw, 56vw"><img src="/assets/migration-console.jpg" width="1400" height="933" alt="An inspection console traces bookmark folders from an input tray to an output tray" decoding="async" fetchpriority="high"></picture><figcaption>Checks the full folder path, not only a folder name.</figcaption></figure></section>${uploadMarkup()}<div id="result-region">${audit ? resultMarkup(audit) : `<section class="empty-instrument"><div class="dial" aria-hidden="true"><span></span></div><div><h2>Four local checks</h2><ol><li><b>Folder paths</b><span>Same name in different places</span></li><li><b>Duplicate links</b><span>Same address after removing tracking details and anything after #</span></li><li><b>URL variants</b><span>Possible redirect or http/https change</span></li><li><b>Link quality</b><span>Missing titles and malformed URLs</span></li></ol></div></section>`}</div>${methodMarkup()}${privacyMarkup()}${toastMarkup()}</main>${footer()}`;
  }
  wireHome();
}
function legalPage(kind: 'privacy' | 'terms'): void { const privacy = kind === 'privacy'; app.innerHTML = `${header(`/${kind}`)}<main id="main" class="legal-page"><p class="eyebrow">${privacy ? 'Privacy' : 'Terms'}</p><h1>${privacy ? 'Your bookmark HTML file stays in your browser' : 'Terms of use'}</h1>${privacy ? `<p class="lede">The audit reads your bookmark HTML file in this browser. It does not upload files or request bookmark URLs.</p><h2>Stored data</h2><p>Your latest real audit stays in this browser until you choose “Forget this audit.” Demo data uses separate storage and is discarded when reset or when you start for real.</p><h2>Network activity</h2><p>This app loads only its own files. It has no analytics, advertising scripts, remote fonts, or tracking cookies.</p>` : `<p class="lede">Use this audit as a careful second opinion. Keep your original bookmark HTML file and review the corrected copy before importing.</p><h2>Use of the tool</h2><p>This app does not simulate your bookmark app. Review the corrected file before importing.</p><h2>Warranty</h2><p>The software is provided as is, without warranty. Source code is available under the MIT License.</p>`}<p class="legal-date">Effective 29 August 2026</p></main>${footer()}`; wireRoutes(); }
function notFound(): void { app.innerHTML = `${header('/404')}<main id="main" class="legal-page not-found"><p class="eyebrow">404</p><h1>That page was not found</h1><p class="lede">Choose the audit home page to check a bookmark HTML file.</p><a class="button primary" href="/" data-route>Go to the audit</a></main>${footer()}`; wireRoutes(); }
function download(name: string, type: string, content: string): void { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function processHtml(html: string, fileName: string): Promise<void> { const status = document.querySelector<HTMLDivElement>('#audit-status'); if (status) status.textContent = 'Reading folder paths and checking links…'; try { audit = makeAuditDocument(html, fileName); await saveAudit(audit, scope); homePage(); document.querySelector('#result-title')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); } catch (error) { if (status) { status.className = 'audit-status error'; status.textContent = error instanceof Error ? error.message : 'The bookmark HTML file could not be read. Export it again and try once more.'; } } }
function wireRoutes(): void { document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate(link.href); })); }
function wireHome(): void {
  wireRoutes();
  const handleFile = async (file?: File): Promise<void> => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      const status = document.querySelector<HTMLDivElement>('#audit-status')!;
      status.className = 'audit-status error';
      status.textContent = 'That file is over 25 MiB. Export a smaller library before auditing.';
      return;
    }
    await processHtml(await file.text(), file.name);
  };
  const input = document.querySelector<HTMLInputElement>('#bookmark-file');
  input?.addEventListener('change', () => { void handleFile(input.files?.[0]); });
  const drop = document.querySelector<HTMLDivElement>('#drop-zone');
  ['dragenter', 'dragover'].forEach((type) => drop?.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach((type) => drop?.addEventListener(type, (event) => { event.preventDefault(); drop.classList.remove('dragging'); }));
  drop?.addEventListener('drop', (event) => { void handleFile(event.dataTransfer?.files[0]); });
  document.querySelector<HTMLSelectElement>('#import-profile')?.addEventListener('change', async (event) => {
    if (!audit) return;
    audit.importProfileId = importProfile((event.currentTarget as HTMLSelectElement).value).id;
    await saveAudit(audit, scope);
    homePage();
    document.querySelector('#result-title')?.scrollIntoView({ block: 'start' });
  });
  document.querySelector('#export-html')?.addEventListener('click', () => audit && download(`${audit.fileName.replace(/\.[^.]+$/, '')}-corrected.html`, 'text/html;charset=utf-8', correctedBookmarkHtml(audit)));
  document.querySelector('#export-csv')?.addEventListener('click', () => audit && download(`${audit.fileName.replace(/\.[^.]+$/, '')}-review.csv`, 'text/csv;charset=utf-8', reviewCsv(audit)));
  document.querySelector('#forget-audit')?.addEventListener('click', async () => { await forgetAudit(scope); audit = undefined; homePage(); });
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { await forgetAudit('demo'); audit = undefined; await processHtml(SAMPLE_BOOKMARKS, 'sample-bookmark-library.html'); });
  const offline = document.querySelector<HTMLElement>('#offline-notice');
  const update = () => { if (offline) offline.hidden = navigator.onLine; };
  update();
  addEventListener('online', update, { once: true });
  addEventListener('offline', update, { once: true });
}
function scopeFor(url = new URL(location.href)): StorageScope { return url.pathname === '/demo' || url.searchParams.has('demo') ? 'demo' : 'real'; }
async function loadRoute(nextScope: StorageScope): Promise<void> {
  // Leaving demo is destructive by design: its separate database must not
  // become a hidden second workspace behind the "nothing is saved" banner.
  if (scope === 'demo' && nextScope === 'real') await forgetAudit('demo');
  audit = await loadAudit(nextScope).catch(() => undefined);
  if (nextScope === 'demo' && !audit) {
    audit = makeAuditDocument(SAMPLE_BOOKMARKS, 'sample-bookmark-library.html');
    await saveAudit(audit, 'demo');
  }
  scope = nextScope;
}
async function navigate(href: string): Promise<void> { const url = new URL(href); history.pushState({}, '', url.pathname + url.search); await loadRoute(scopeFor(url)); render(true); }
function render(moveFocus = false): void { const path = route(); scope = path === '/demo' || new URLSearchParams(location.search).has('demo') ? 'demo' : 'real'; setMeta(scope === 'demo' ? '/demo' : path); if (path === '/privacy' || path === '/terms') legalPage(path.slice(1) as 'privacy' | 'terms'); else if (path === '/404') notFound(); else homePage(); if (moveFocus) { const h1 = document.querySelector<HTMLElement>('h1'); h1?.setAttribute('tabindex', '-1'); h1?.focus(); announce(`${document.title}.`); } }
function announce(message: string): void { let region = document.querySelector<HTMLElement>('#route-announcer'); if (!region) { region = document.createElement('div'); region.id = 'route-announcer'; region.className = 'sr-only'; region.setAttribute('aria-live', 'polite'); document.body.append(region); } region.textContent = message; }
async function registerServiceWorker(): Promise<void> { if (!('serviceWorker' in navigator)) return; let refreshing = false; const registration = await navigator.serviceWorker.register('/sw.js'); registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { const toast = document.querySelector<HTMLElement>('#update-toast'); if (toast) toast.hidden = false; document.querySelector('#refresh-app')?.addEventListener('click', () => { refreshing = true; worker.postMessage({ type: 'SKIP_WAITING' }); }); } }); }); navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshing) location.reload(); }); }
async function start(): Promise<void> { window.addEventListener('popstate', () => { loadRoute(scopeFor()).then(() => render(true)).catch(() => render(true)); }); await loadRoute(scopeFor()); render(); registerServiceWorker().catch(() => undefined); }
start();
