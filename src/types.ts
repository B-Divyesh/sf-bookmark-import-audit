export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderPath: string[];
  addDate?: string;
}

export interface Folder {
  path: string[];
  title: string;
  parentPath: string[];
}

export interface FolderCollision {
  title: string;
  paths: string[][];
}

export interface UrlCluster {
  key: string;
  bookmarks: Bookmark[];
}

export interface AuditResult {
  folderCollisions: FolderCollision[];
  duplicateClusters: UrlCluster[];
  variantClusters: UrlCluster[];
  missingTitles: Bookmark[];
  invalidUrls: Bookmark[];
  maxDepth: number;
}

export interface AuditDocument {
  version: 1;
  createdAt: string;
  fileName: string;
  bookmarks: Bookmark[];
  folders: Folder[];
  result: AuditResult;
}
