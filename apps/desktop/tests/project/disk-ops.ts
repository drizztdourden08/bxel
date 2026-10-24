/* @layer renderer-app @kind test */
import type { DocumentsPort, DocumentWatchEvent, DocumentWatchKind, RememberedFolder } from '@drizztdourden08/brock-core';
import { inside, key, parentOf, under } from './disk-paths';
import type { Disk } from './memory-disk';
import { quietDocuments } from './quiet-documents';

const rebase = (path: string, from: string, to: string): string => `${to}${path.slice(from.length)}`;

const has = (disk: Disk, path: string): boolean =>
  [...disk.files.keys(), ...disk.dirs].some((each) => key(each) === key(path));

const emit = (disk: Disk, path: string, kind: DocumentWatchKind): void => {
  for (const [folder, listeners] of disk.watchers) {
    if (key(folder) === key(parentOf(path))) for (const listener of listeners) listener({ kind, path });
  }
};

const refuse = (disk: Disk, path: string): Promise<never> | null =>
  inside(disk, path) ? null : Promise.reject(new Error(`"${path}" is outside the granted folders`));

const moveAll = (disk: Disk, from: string, to: string): void => {
  for (const [path, content] of [...disk.files]) {
    if (!under(path, from)) continue;
    disk.files.delete(path);
    disk.files.set(rebase(path, from, to), content);
  }
  for (const dir of [...disk.dirs]) {
    if (!under(dir, from)) continue;
    disk.dirs.delete(dir);
    disk.dirs.add(rebase(dir, from, to));
  }
};

const dropAll = (disk: Disk, path: string): void => {
  for (const file of [...disk.files.keys()]) if (under(file, path)) disk.files.delete(file);
  for (const dir of [...disk.dirs]) if (under(dir, path)) disk.dirs.delete(dir);
};

const rename = (disk: Disk, from: string, to: string, options?: { overwrite?: boolean }): Promise<void> => {
  const refused = refuse(disk, from) ?? refuse(disk, to);
  if (refused) return refused;
  if (!has(disk, from)) return Promise.reject(new Error(`ENOENT: ${from}`));
  if (key(from) !== key(to) && has(disk, to) && options?.overwrite !== true) return Promise.reject(new Error(`EEXIST: ${to}`));
  moveAll(disk, from, to);
  disk.renamed.push(`${from} -> ${to}`);
  emit(disk, from, 'remove');
  emit(disk, to, 'add');
  return Promise.resolve();
};

const trash = (disk: Disk, path: string): Promise<void> => {
  const refused = refuse(disk, path);
  if (refused) return refused;
  if (!has(disk, path)) return Promise.reject(new Error(`ENOENT: ${path}`));
  dropAll(disk, path);
  disk.trashed.push(path);
  emit(disk, path, 'remove');
  return Promise.resolve();
};

const mkdir = (disk: Disk, path: string): Promise<void> => {
  const refused = refuse(disk, path);
  if (refused) return refused;
  disk.dirs.add(path);
  disk.made.push(path);
  return Promise.resolve();
};

const watch = (disk: Disk, folder: string, listener: (event: DocumentWatchEvent) => void): Promise<() => void> => {
  const listeners = disk.watchers.get(folder) ?? new Set();
  listeners.add(listener);
  disk.watchers.set(folder, listeners);
  return Promise.resolve(() => {
    listeners.delete(listener);
  });
};

const regrant = (disk: Disk, path: string): Promise<string> => {
  const known = [...disk.remembered].some((each) => key(each) === key(path));
  if (!known || !has(disk, path)) return Promise.reject(new Error(`"${path}" cannot be restored`));
  disk.granted.add(key(path));
  return Promise.resolve(path);
};

const forget = (disk: Disk, path: string): Promise<boolean> => {
  disk.forgotten.push(path);
  const found = [...disk.remembered].filter((each) => key(each) === key(path));
  for (const each of found) disk.remembered.delete(each);
  return Promise.resolve(found.length > 0);
};

const remembered = (disk: Disk): Promise<RememberedFolder[]> =>
  Promise.resolve(
    [...disk.remembered].map((path) => ({ path, name: path.slice(path.lastIndexOf('/') + 1), lastOpened: 1, available: has(disk, path) })),
  );

const diskOps = (get: () => Disk): Pick<DocumentsPort, keyof typeof quietDocuments> => ({
  ...quietDocuments,
  revokeFolder: (path) => {
    const disk = get();
    disk.revoked.push(path);
    return Promise.resolve(disk.granted.delete(key(path)));
  },
  trash: (path) => trash(get(), path),
  rename: (from, to, options) => rename(get(), from, to, options),
  mkdir: (path) => mkdir(get(), path),
  watch: (folder, _options, listener) => watch(get(), folder, listener),
  rememberedFolders: () => remembered(get()),
  regrant: (path) => regrant(get(), path),
  forgetFolder: (path) => forget(get(), path),
});

export { diskOps, emit };
