/* @layer renderer-app @kind logic */
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { uniquePath } from '../workspace/unique-path';
import { copyName } from '../asset-list/copy-name';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { CopyPlan, Relocation } from './file-ops.type';

const within = (path: string, folder: string): boolean => path.toLowerCase() === folder.toLowerCase() || path.toLowerCase().startsWith(`${folder.toLowerCase()}/`);

const stemOf = (name: string, isFolder: boolean): number => {
  const dot = name.lastIndexOf('.');
  return isFolder || dot <= 0 ? name.length : dot;
};

const freeName = (target: string, name: string, isFolder: boolean, taken: Set<string>): string => {
  const stem = stemOf(name, isFolder);
  const chosen = taken.has(`${target}/${name}`.toLowerCase()) ? uniquePath(target, copyName([], name.slice(0, stem)), name.slice(stem), taken) : `${target}/${name}`;
  taken.add(chosen.toLowerCase());
  return chosen;
};

const kindOf = async (documents: DocumentsPort, path: string): Promise<DocumentEntry['kind'] | null> => {
  const listing = await documents.list(parentOf(path)).catch(() => null);
  return listing?.entries.find((entry) => toSlashes(entry.path).toLowerCase() === path.toLowerCase())?.kind ?? null;
};

const expand = async (documents: DocumentsPort, from: string, to: string): Promise<CopyPlan> => {
  const listing = await documents.list(from, { recursive: true }).catch(() => ({ entries: [] as DocumentEntry[] }));
  const inner = listing.entries.map((entry) => ({ kind: entry.kind, from: toSlashes(entry.path), to: `${to}${toSlashes(entry.path).slice(from.length)}` }));
  const folders = [to, ...inner.filter((entry) => entry.kind === 'folder').map((entry) => entry.to)].sort((a, b) => a.length - b.length);
  const files: Relocation[] = inner.filter((entry) => entry.kind === 'file').map((entry) => ({ from: entry.from, to: entry.to }));
  return { folders, files };
};

const planCopiesIn = async (documents: DocumentsPort, paths: readonly string[], toFolder: string): Promise<CopyPlan | string> => {
  const target = toSlashes(toFolder).replace(/\/$/, '');
  const listing = await documents.list(target).catch(() => null);
  if (listing === null) return FILE_OPS_TEXT.unreachable(fileName(target));
  const taken = new Set(listing.entries.map((entry) => toSlashes(entry.path).toLowerCase()));
  const folders: string[] = [];
  const files: Relocation[] = [];
  for (const path of paths.map(toSlashes)) {
    const kind = await kindOf(documents, path);
    if (kind === null) return FILE_OPS_TEXT.missing(fileName(path));
    if (kind === 'folder' && within(target, path)) return FILE_OPS_TEXT.intoItself;
    const to = freeName(target, fileName(path), kind === 'folder', taken);
    if (kind === 'file') files.push({ from: path, to });
    else {
      const inner = await expand(documents, path, to);
      folders.push(...inner.folders);
      files.push(...inner.files);
    }
  }
  return files.length === 0 && folders.length === 0 ? FILE_OPS_TEXT.nothingToCopy : { folders, files };
};

export { planCopiesIn };
