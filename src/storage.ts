import type { AuditDocument } from './types';

const DB_NAME = 'bookmark-import-audit';
const STORE = 'state';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function saveAudit(audit: AuditDocument): Promise<void> {
  await transact('readwrite', (store) => store.put(audit, 'latest'));
}

export async function loadAudit(): Promise<AuditDocument | undefined> {
  return transact('readonly', (store) => store.get('latest'));
}

export async function forgetAudit(): Promise<void> {
  await transact('readwrite', (store) => store.delete('latest'));
}

export interface Worksheet {
  destination: string;
  notes: string;
  backupConfirmed: boolean;
  dryRunConfirmed: boolean;
  spotCheckConfirmed: boolean;
}

export async function saveWorksheet(worksheet: Worksheet): Promise<void> {
  await transact('readwrite', (store) => store.put(worksheet, 'worksheet'));
}

export async function loadWorksheet(): Promise<Worksheet | undefined> {
  return transact('readonly', (store) => store.get('worksheet'));
}
