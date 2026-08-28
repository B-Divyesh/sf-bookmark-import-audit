import type { AuditDocument } from './types';

const STORE = 'state';
export type StorageScope = 'real' | 'demo';

function database(scope: StorageScope): Promise<IDBDatabase> {
  // Demo never opens the ordinary database. This is deliberate isolation, not
  // merely a different record key inside shared user data.
  const name = scope === 'demo' ? 'demo:bookmark-import-audit' : 'bookmark-import-audit';
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact<T>(scope: StorageScope, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database(scope);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function saveAudit(audit: AuditDocument, scope: StorageScope): Promise<void> {
  await transact(scope, 'readwrite', (store) => store.put(audit, 'latest'));
}

export async function loadAudit(scope: StorageScope): Promise<AuditDocument | undefined> {
  return transact(scope, 'readonly', (store) => store.get('latest'));
}

export async function forgetAudit(scope: StorageScope): Promise<void> {
  await transact(scope, 'readwrite', (store) => store.delete('latest'));
}
