/* @layer renderer-app @kind test */
import type { DocumentEntry, DocumentListing, DocumentListOptions, DocumentsPort, DocumentWatchEvent } from '@drizztdourden08/brock-core';
import { diskOps } from './disk-ops';
import { inside, key, parentOf } from './disk-paths';

type Disk = {
  readonly port: DocumentsPort;
  readonly files: Map<string, string | Uint8Array>;
  readonly dirs: Set<string>;
  readonly granted: Set<string>;
  readonly remembered: Set<string>;
  readonly watchers: Map<string, Set<(event: DocumentWatchEvent) => void>>;
  readonly picks: { folder: string | null };
  readonly writes: string[];
  readonly revoked: string[];
  readonly trashed: string[];
  readonly renamed: string[];
  readonly made: string[];
  readonly forgotten: string[];
};

const exists = (disk: Pick<Disk, 'dirs' | 'granted'>, folder: string): boolean =>
  disk.granted.has(key(folder)) || [...disk.dirs].some((dir) => key(dir) === key(folder));

const entryOf = (path: string, kind: 'file' | 'folder', size: number): DocumentEntry => ({
  path,
  name: path.slice(path.lastIndexOf('/') + 1),
  kind,
  size,
  modified: 1_700_000_000_000,
  link: false,
});

const sizeOf = (content: string | Uint8Array): number => (typeof content === 'string' ? content.length : content.length);

const childrenOf = (disk: Pick<Disk, 'files' | 'dirs'>, folder: string): DocumentEntry[] => {
  const base = key(folder);
  const files = [...disk.files].filter(([path]) => key(parentOf(path)) === base).map(([path, content]) => entryOf(path, 'file', sizeOf(content)));
  const dirs = [...disk.dirs].filter((path) => key(parentOf(path)) === base).map((path) => entryOf(path, 'folder', 0));
  return [...dirs, ...files];
};

const listOf = (disk: Disk, folder: string, options?: DocumentListOptions): Promise<DocumentListing> => {
  if (!inside(disk, folder)) return Promise.reject(new Error(`"${folder}" is not inside a granted folder`));
  if (!exists(disk, folder)) return Promise.reject(new Error(`ENOENT: no such directory, scandir '${folder}'`));
  const wanted = options?.extensions?.map((extension) => extension.toLowerCase());
  const entries = childrenOf(disk, folder).filter(
    (entry) => wanted === undefined || (entry.kind === 'file' && wanted.includes(entry.name.split('.').at(-1)?.toLowerCase() ?? '')),
  );
  return Promise.resolve({ entries, truncated: false });
};

const memoryDisk = (): Disk => {
  const disk: Disk = {
    files: new Map(),
    dirs: new Set(),
    granted: new Set(),
    remembered: new Set(),
    watchers: new Map(),
    picks: { folder: null },
    writes: [],
    revoked: [],
    trashed: [],
    renamed: [],
    made: [],
    forgotten: [],
    port: {
      open: () => Promise.resolve(null),
      saveAs: () => Promise.resolve(null),
      openFolder: () => {
        if (disk.picks.folder !== null) {
          disk.granted.add(key(disk.picks.folder));
          disk.remembered.add(disk.picks.folder);
        }
        return Promise.resolve(disk.picks.folder);
      },
      list: (folder, options) => listOf(disk, folder, options),
      read: (path) => {
        const content = disk.files.get(path);
        if (!inside(disk, path) || content === undefined) return Promise.reject(new Error(`No file at ${path}`));
        return Promise.resolve(typeof content === 'string' ? new TextEncoder().encode(content) : content);
      },
      readText: (path) => {
        const content = disk.files.get(path);
        if (!inside(disk, path) || typeof content !== 'string') return Promise.reject(new Error(`No text at ${path}`));
        return Promise.resolve(content);
      },
      write: (path, data) => {
        if (!inside(disk, path)) return Promise.reject(new Error(`"${path}" is outside the granted folders`));
        disk.files.set(path, data);
        disk.writes.push(path);
        return Promise.resolve();
      },
      writeText: (path, text) => {
        if (!inside(disk, path)) return Promise.reject(new Error(`"${path}" is outside the granted folders`));
        disk.files.set(path, text);
        disk.writes.push(path);
        return Promise.resolve();
      },
      ...diskOps(() => disk),
      recent: () => Promise.resolve([]),
      openRecent: (path) => Promise.resolve(path),
    },
  };
  return disk;
};

export { memoryDisk };
export type { Disk };
