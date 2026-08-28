import './styles.css';
import { correctedBookmarkHtml, makeAuditDocument, repairLedger, reviewCsv } from './audit';
import { acceptReturnedLicense, checkoutUrl, initialLicenseState, storeLicense, verifyLicense, type LicenseState } from './license';
import { SAMPLE_BOOKMARKS } from './sample';
import { forgetAudit, loadAudit, loadWorksheet, saveAudit, saveWorksheet, type Worksheet } from './storage';
import type { AuditDocument, Bookmark, FolderCollision, UrlCluster } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
let audit: AuditDocument | undefined;
let license: LicenseState = { unlocked: false, verifying: false };
let worksheet: Worksheet = { destination: '', notes: '', backupConfirmed: false, dryRunConfirmed: false, spotCheckConfirmed: false };

const escapeHtml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function header(active: 'audit' | 'privacy' | 'terms' = 'audit'): string {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="BIA — Bookmark Import Audit home"><span class="brand-mark" aria-hidden="true">BIA</span><span>Field instrument <b>01</b></span></a>
    <nav aria-label="Site"><a ${active === 'audit' ? 'aria-current="page"' : ''} href="/">Audit</a><a ${active === 'privacy' ? 'aria-current="page"' : ''} href="/privacy">Privacy</a><a ${active === 'terms' ? 'aria-current="page"' : ''} href="/terms">Terms</a></nav>
  </header>`;
}

function footer(): string {
  return `<footer><p><strong>Bookmark Import Audit</strong> runs locally. No bookmark leaves this device.</p><p><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Generated hero artwork disclosed in the <a href="https://github.com/B-Divyesh/sf-bookmark-import-audit" rel="noreferrer">source</a>.</p></footer>`;
}

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  document.title = `${privacy ? 'Privacy' : 'Terms'} — Bookmark Import Audit`;
  app.innerHTML = `${header(kind)}<main id="main" class="legal-page">
    <p class="eyebrow">Field manual / ${privacy ? 'privacy' : 'terms'}</p>
    <h1>${privacy ? 'Your bookmark file stays yours.' : 'Terms of use'}</h1>
    ${privacy ? `<p class="lede">Bookmark Import Audit processes files entirely in your browser. We do not upload, crawl, sell, or analyze your bookmarks.</p>
      <h2>Data stored on this device</h2><p>Your latest parsed audit and, if unlocked, your migration worksheet are kept in IndexedDB so work survives a refresh. Your license token and a daily verification verdict are kept in localStorage. Use “Forget this audit” to remove the audit. Clearing this site’s browser data removes everything.</p>
      <h2>Network requests</h2><p>The audit engine makes no network requests for bookmark URLs. It does not resolve redirects. The only optional request is license verification with Sociobot when you enter or receive a license. The checkout is hosted by Sociobot/Dodo, the merchant of record, and their privacy terms apply there.</p>
      <h2>Analytics and cookies</h2><p>There are no analytics, advertising scripts, third-party fonts, tracking cookies, or page-view beacons in this app.</p>` : `<p class="lede">Use this tool as a careful second opinion—not as a substitute for keeping the original export.</p>
      <h2>License</h2><p>The free audit and export tools may be used without an account. Plus is a one-time purchase for one person’s use. Sociobot/Dodo is the merchant of record; refunds are handled by the merchant and revoke the associated license.</p>
      <h2>No destructive promises</h2><p>The corrected export preserves every parsed bookmark and changes collision-prone folder labels. Browser and manager import behavior varies. Keep your original export, import into an empty destination when possible, and spot-check the result.</p>
      <h2>Warranty</h2><p>The software is provided “as is,” without warranty. To the extent allowed by law, the authors are not liable for data loss or indirect damages. The source code is also available under the MIT License.</p>`}
    <p class="legal-date">Effective 28 August 2026 · <a href="/">Return to the audit</a></p>
  </main>${footer()}`;
}

function pathLabel(path: string[]): string {
  return path.length ? path.map(escapeHtml).join('<span aria-hidden="true"> › </span>') : '<em>Top level</em>';
}

function clusterMarkup(cluster: UrlCluster, type: 'duplicate' | 'variant'): string {
  return `<li class="finding"><div class="finding-head"><span class="status ${type === 'duplicate' ? 'warn' : 'info'}">${type === 'duplicate' ? 'Review copies' : 'Verify target'}</span><strong>${cluster.bookmarks.length} links</strong></div>
    <code>${escapeHtml(cluster.key)}</code>
    <ul class="trace-list">${cluster.bookmarks.map((bookmark) => `<li><span>${escapeHtml(bookmark.title || '(missing title)')}</span><small>${pathLabel(bookmark.folderPath)}</small><small class="break">${escapeHtml(bookmark.url)}</small></li>`).join('')}</ul></li>`;
}

function collisionMarkup(collision: FolderCollision): string {
  return `<li class="finding"><div class="finding-head"><span class="status danger">May merge</span><strong>“${escapeHtml(collision.title)}” appears in ${collision.paths.length} branches</strong></div>
    <ul class="trace-list">${collision.paths.map((path) => `<li>${pathLabel(path)}</li>`).join('')}</ul></li>`;
}

function missingMarkup(bookmark: Bookmark, invalid = false): string {
  return `<li class="finding compact"><span class="status ${invalid ? 'danger' : 'warn'}">${invalid ? 'Repair URL' : 'Title fallback'}</span><div><strong>${escapeHtml(bookmark.title || '(missing title)')}</strong><small>${pathLabel(bookmark.folderPath)}</small><code>${escapeHtml(bookmark.url)}</code></div></li>`;
}

function resultMarkup(document: AuditDocument): string {
  const { result } = document;
  const issueCount = result.folderCollisions.length + result.duplicateClusters.length + result.variantClusters.length + result.missingTitles.length + result.invalidUrls.length;
  const ledger = repairLedger(document);
  return `<section class="results reveal" aria-labelledby="result-title">
    <div class="result-header"><div><p class="eyebrow">Inspection complete</p><h2 id="result-title">${issueCount ? `${issueCount} review ${issueCount === 1 ? 'item' : 'items'} found` : 'No import hazards found'}</h2><p>${escapeHtml(document.fileName)} · checked ${new Date(document.createdAt).toLocaleString()}</p></div><span class="seal ${issueCount ? 'review' : 'clear'}" aria-label="${issueCount ? 'Review needed' : 'Clear'}">${issueCount ? 'Review' : 'Clear'}</span></div>
    <div class="gauges" aria-label="Library inventory">
      <div><span>${document.bookmarks.length}</span><b>Bookmarks</b></div>
      <div><span>${document.folders.length}</span><b>Folders</b></div>
      <div><span>${result.maxDepth}</span><b>Levels deep</b></div>
      <div><span>${issueCount}</span><b>Findings</b></div>
    </div>
    ${issueCount === 0 ? `<div class="clear-state"><span aria-hidden="true">✓</span><div><h3>This library is structurally tidy.</h3><p>Keep the original file, then use the corrected export as a clean copy for your destination manager.</p></div></div>` : ''}
    ${result.folderCollisions.length ? `<section class="finding-section" aria-labelledby="collision-title"><div class="section-number">01</div><div><h3 id="collision-title">Folder-path collisions</h3><p>Some importers merge folders by label instead of full path. These names are safe where they are now, but risky during import.</p><ol class="finding-list">${result.folderCollisions.map(collisionMarkup).join('')}</ol></div></section>` : ''}
    ${result.duplicateClusters.length ? `<section class="finding-section" aria-labelledby="duplicate-title"><div class="section-number">02</div><div><h3 id="duplicate-title">Normalized duplicates</h3><p>Tracking parameters, fragments, query order, and trailing slashes are normalized deterministically. Copies remain in the export because their folder context may be meaningful.</p><ol class="finding-list">${result.duplicateClusters.map((cluster) => clusterMarkup(cluster, 'duplicate')).join('')}</ol></div></section>` : ''}
    ${result.variantClusters.length ? `<section class="finding-section" aria-labelledby="variant-title"><div class="section-number">03</div><div><h3 id="variant-title">Likely URL variants</h3><p>These differ by HTTP/HTTPS, <code>www</code>, or a recognizable redirect wrapper. No URL was fetched, so verify the target manually.</p><ol class="finding-list">${result.variantClusters.map((cluster) => clusterMarkup(cluster, 'variant')).join('')}</ol></div></section>` : ''}
    ${(result.missingTitles.length || result.invalidUrls.length) ? `<section class="finding-section" aria-labelledby="quality-title"><div class="section-number">04</div><div><h3 id="quality-title">Link quality</h3><p>Missing titles receive a hostname fallback in the corrected copy. Invalid URLs are preserved and listed for manual repair.</p><ul class="finding-list">${result.missingTitles.map((bookmark) => missingMarkup(bookmark)).join('')}${result.invalidUrls.map((bookmark) => missingMarkup(bookmark, true)).join('')}</ul></div></section>` : ''}
    <section class="repair-section" aria-labelledby="repair-title"><div><p class="eyebrow">Non-destructive repair</p><h3 id="repair-title">Your corrected copy is ready.</h3><p>Every parsed bookmark and nesting level is preserved. Only collision-prone folder labels and blank titles are made import-safe.</p></div>
      ${ledger.length ? `<div class="ledger" role="region" aria-label="Folder rename ledger" tabindex="0"><table><thead><tr><th>Original path</th><th>Exported folder label</th></tr></thead><tbody>${ledger.map((item) => `<tr><td data-label="Original">${escapeHtml(item.before)}</td><td data-label="Exported">${escapeHtml(item.after)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="no-change"><strong>No folder renames needed.</strong> The corrected copy only fills any blank titles.</p>`}
      <div class="export-actions"><button class="button primary" id="export-html">Export corrected HTML</button><button class="button secondary" id="export-csv">Export review CSV</button><button class="button quiet" id="forget-audit">Forget this audit</button></div>
      <p class="caution"><strong>Keep the original export.</strong> Import the corrected copy into an empty destination and spot-check it before deleting anything.</p>
    </section>
  </section>`;
}

function plusMarkup(): string {
  if (license.unlocked) {
    return `<section class="plus-panel unlocked" aria-labelledby="plus-title"><div class="plus-heading"><div><p class="eyebrow">Plus unlocked</p><h2 id="plus-title">Migration sign-off worksheet</h2></div><span class="status safe">License active</span></div>
      <p>Keep destination notes and three deliberate checks with this device. Audit and exports remain free for everyone.</p>
      <form id="worksheet-form"><div class="field"><label for="destination">Destination manager</label><input id="destination" name="destination" value="${escapeHtml(worksheet.destination)}" autocomplete="off"></div>
        <fieldset><legend>Sign-off checks</legend>${[['backupConfirmed','Original export backed up'],['dryRunConfirmed','Imported into an empty destination'],['spotCheckConfirmed','Spot-checked nested folders']].map(([key,label]) => `<label class="check"><input type="checkbox" name="${key}" ${worksheet[key as keyof Worksheet] ? 'checked' : ''}><span>${label}</span></label>`).join('')}</fieldset>
        <div class="field"><label for="notes">Migration notes</label><textarea id="notes" name="notes" rows="4">${escapeHtml(worksheet.notes)}</textarea></div><button class="button secondary" type="submit">Save worksheet</button><span id="worksheet-status" class="form-status" role="status"></span></form>
    </section>`;
  }
  return `<section class="plus-panel" aria-labelledby="plus-title"><div><p class="eyebrow">Optional one-time unlock</p><h2 id="plus-title">Carry a signed-off migration plan.</h2><p>Plus adds a locally saved destination worksheet, verification checklist, and migration notes. The full audit, corrected HTML, CSV, accessibility, and safety guidance stay free.</p></div>
    <div class="price"><span>$9</span><small>one time</small><a class="button primary" href="${checkoutUrl()}">Buy Plus</a></div>
    <details><summary>Have a license? Restore it</summary><form id="license-form"><label for="license-token">License token</label><div class="inline-field"><input id="license-token" name="license" required autocomplete="off" spellcheck="false"><button class="button secondary" type="submit">Verify license</button></div><p class="form-status" id="license-status" role="status">${escapeHtml(license.notice ?? (license.verifying ? 'Checking license…' : ''))}</p></form></details>
    <p class="fine-print">Checkout is hosted by Sociobot/Dodo, the merchant of record. Refunds are handled there and revoke the license. See <a href="/privacy">privacy</a> and <a href="/terms">terms</a>.</p>
  </section>`;
}

function homePage(): void {
  document.title = 'Bookmark Import Audit — inspect before you import';
  app.innerHTML = `${header()}<main id="main">
    <section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="lamp" aria-hidden="true"></span> Local migration instrument</p><h1>Inspect before<br>you import.</h1><p class="lede">Find folder merges, duplicate links, URL variants, and missing titles before a new bookmark manager changes your library.</p><ul class="trust-list"><li>Runs on this device</li><li>No crawling or upload</li><li>Original stays untouched</li></ul><a class="text-link" href="#audit-bench">Go to the audit bench <span aria-hidden="true">↓</span></a></div>
      <figure><picture><source type="image/webp" srcset="/assets/migration-console-800.webp 800w, /assets/migration-console-1400.webp 1400w" sizes="(max-width: 800px) 92vw, 56vw"><img src="/assets/migration-console.jpg" width="1400" height="933" alt="A mid-century inspection console tracing one filing path into multiple orderly branches" decoding="async" fetchpriority="high"></picture><figcaption>Path-aware inspection: the branch matters as much as the label.</figcaption></figure>
    </section>
    <section class="bench" id="audit-bench" aria-labelledby="bench-title"><div class="bench-intro"><p class="eyebrow">Input / Netscape HTML</p><h2 id="bench-title">Load a browser export</h2><p>Chrome, Firefox, Safari, Edge, Linkwarden, and most bookmark tools export this format. Maximum 25 MB.</p></div>
      <div class="file-well" id="drop-zone"><input id="bookmark-file" type="file" accept=".html,.htm,text/html"><label for="bookmark-file"><span class="input-icon" aria-hidden="true"><i></i><i></i><i></i></span><strong>Choose bookmark HTML</strong><small>or drop the file onto this tray</small></label><button class="sample-button" id="try-sample" type="button">Try a small example</button></div>
      <div id="audit-status" class="audit-status" role="status" aria-live="polite"></div>
    </section>
    <div id="result-region">${audit ? resultMarkup(audit) : `<section class="empty-instrument" aria-label="What this audit checks"><div class="dial" aria-hidden="true"><span></span></div><div><h2>Four checks. Zero network lookups.</h2><ol><li><b>Folder collisions</b><span>Same label, different path</span></li><li><b>Normalized duplicates</b><span>Safe deterministic matching</span></li><li><b>URL variants</b><span>Marked as likely, never assumed</span></li><li><b>Missing metadata</b><span>Titles and malformed URLs</span></li></ol></div></section>`}</div>
    <section class="method" aria-labelledby="method-title"><div><p class="eyebrow">Method / deterministic</p><h2 id="method-title">No black box. No surprise deletions.</h2></div><div class="method-grid"><p><b>Path-aware</b>Folders are compared by their full ancestry. A “Research” folder under Work stays distinct from “Research” under Personal.</p><p><b>Conservative</b>Tracking parameters and fragments are ignored for review, but every link remains in the corrected HTML.</p><p><b>Honest about redirects</b>The app recognizes scheme, host, and wrapper patterns locally. It never claims to have followed a URL.</p></div></section>
    ${plusMarkup()}
    <div id="offline-notice" class="toast" role="status" hidden><span>Offline mode: the audit still works.</span></div><div id="update-toast" class="toast update" role="status" hidden><span>An app update is ready.</span><button type="button" id="refresh-app">Refresh</button></div>
  </main>${footer()}`;
  wireHome();
}

function download(name: string, type: string, content: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function processHtml(html: string, fileName: string): Promise<void> {
  const status = document.querySelector<HTMLDivElement>('#audit-status');
  if (status) status.textContent = 'Reading paths and measuring import risks…';
  await new Promise((resolve) => setTimeout(resolve, 20));
  try {
    audit = makeAuditDocument(html, fileName);
    await saveAudit(audit).catch(() => undefined);
    homePage();
    document.querySelector('#result-title')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  } catch (error) {
    if (status) {
      status.className = 'audit-status error';
      status.textContent = error instanceof Error ? error.message : 'The bookmark file could not be read. Try exporting it again.';
    }
  }
}

function wireHome(): void {
  const input = document.querySelector<HTMLInputElement>('#bookmark-file');
  input?.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      const status = document.querySelector<HTMLDivElement>('#audit-status')!;
      status.className = 'audit-status error';
      status.textContent = 'That file is over 25 MB. Export a smaller library or split it before auditing.';
      return;
    }
    await processHtml(await file.text(), file.name);
  });
  document.querySelector('#try-sample')?.addEventListener('click', () => processHtml(SAMPLE_BOOKMARKS, 'example-bookmarks.html'));
  const drop = document.querySelector<HTMLDivElement>('#drop-zone');
  ['dragenter', 'dragover'].forEach((type) => drop?.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach((type) => drop?.addEventListener(type, (event) => { event.preventDefault(); drop.classList.remove('dragging'); }));
  drop?.addEventListener('drop', async (event) => {
    const file = event.dataTransfer?.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      const status = document.querySelector<HTMLDivElement>('#audit-status')!;
      status.className = 'audit-status error';
      status.textContent = 'That file is over 25 MB. Export a smaller library or split it before auditing.';
      return;
    }
    await processHtml(await file.text(), file.name);
  });
  document.querySelector('#export-html')?.addEventListener('click', () => audit && download(`${audit.fileName.replace(/\.[^.]+$/, '')}-collision-safe.html`, 'text/html;charset=utf-8', correctedBookmarkHtml(audit)));
  document.querySelector('#export-csv')?.addEventListener('click', () => audit && download(`${audit.fileName.replace(/\.[^.]+$/, '')}-review.csv`, 'text/csv;charset=utf-8', reviewCsv(audit)));
  document.querySelector('#forget-audit')?.addEventListener('click', async () => {
    if (!audit || !confirm(`Forget the saved audit for “${audit.fileName}”? Your original file and downloaded exports are not affected.`)) return;
    await forgetAudit().catch(() => undefined); audit = undefined; homePage();
    document.querySelector('#audit-bench')?.scrollIntoView();
  });
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    storeLicense(String(data.get('license') ?? ''));
    const status = document.querySelector('#license-status');
    if (status) status.textContent = 'Checking license…';
    license = await verifyLicense(true);
    homePage();
    document.querySelector('#plus-title')?.scrollIntoView();
  });
  document.querySelector<HTMLFormElement>('#worksheet-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form);
    worksheet = { destination: String(data.get('destination') ?? ''), notes: String(data.get('notes') ?? ''), backupConfirmed: data.has('backupConfirmed'), dryRunConfirmed: data.has('dryRunConfirmed'), spotCheckConfirmed: data.has('spotCheckConfirmed') };
    await saveWorksheet(worksheet).catch(() => undefined);
    const status = document.querySelector('#worksheet-status'); if (status) status.textContent = 'Saved on this device.';
  });
  const offlineNotice = document.querySelector<HTMLElement>('#offline-notice');
  const updateNetwork = () => { if (offlineNotice) { offlineNotice.hidden = navigator.onLine; } };
  updateNetwork(); window.addEventListener('online', updateNetwork, { once: true }); window.addEventListener('offline', updateNetwork, { once: true });
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  let refreshing = false;
  const registration = await navigator.serviceWorker.register('/sw.js');
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    worker?.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        const toast = document.querySelector<HTMLElement>('#update-toast'); if (toast) toast.hidden = false;
        document.querySelector('#refresh-app')?.addEventListener('click', () => { refreshing = true; worker.postMessage({ type: 'SKIP_WAITING' }); });
      }
    });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshing) window.location.reload(); });
}

async function start(): Promise<void> {
  const page = window.location.pathname.replace(/\/$/, '') || '/';
  if (page === '/privacy' || page === '/terms') { legalPage(page.slice(1) as 'privacy' | 'terms'); registerServiceWorker().catch(() => undefined); return; }
  acceptReturnedLicense();
  license = initialLicenseState();
  [audit, worksheet] = await Promise.all([loadAudit().catch(() => undefined), loadWorksheet().catch(() => undefined)]).then(([savedAudit, savedWorksheet]) => [savedAudit, savedWorksheet ?? worksheet]);
  homePage();
  if (license.verifying) verifyLicense().then((state) => { license = state; homePage(); }).catch(() => undefined);
  registerServiceWorker().catch(() => undefined);
}

start();
