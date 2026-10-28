/* @layer renderer-app @kind logic */
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import type { BrowserEntry, BrowserSort, FileEntry, FolderEntry } from './project-browser.type';

const natural = (left: string, right: string): number => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });

const byName = (left: FileEntry, right: FileEntry): number => natural(left.row.name, right.row.name) || natural(left.row.path, right.row.path);

const pixels = (entry: FileEntry): number => (entry.facts.width ?? 0) * (entry.facts.height ?? 0);

const COMPARE = {
  name: byName,
  kind: (left: FileEntry, right: FileEntry): number => KIND_ORDER.indexOf(left.row.kind) - KIND_ORDER.indexOf(right.row.kind) || byName(left, right),
  modified: (left: FileEntry, right: FileEntry): number => left.row.modified - right.row.modified || byName(left, right),
  folder: (left: FileEntry, right: FileEntry): number => natural(left.row.folder, right.row.folder) || byName(left, right),
  size: (left: FileEntry, right: FileEntry): number => pixels(left) - pixels(right) || byName(left, right),
  frames: (left: FileEntry, right: FileEntry): number => (left.facts.frames ?? 0) - (right.facts.frames ?? 0) || byName(left, right),
  usedBy: (left: FileEntry, right: FileEntry): number => left.facts.usedBy.length - right.facts.usedBy.length || byName(left, right),
} as const;

const isFolder = (entry: BrowserEntry): entry is FolderEntry => entry.kind === 'folder';

/** Folders first, by name. Files follow in the order asked for. */
const sortEntries = (entries: readonly BrowserEntry[], sort: BrowserSort): readonly BrowserEntry[] => {
  const folders = entries.filter(isFolder).sort((left, right) => natural(left.name, right.name));
  const files = entries.filter((entry): entry is FileEntry => entry.kind === 'file').sort(COMPARE[sort.key]);
  return [...folders, ...(sort.descending ? files.reverse() : files)];
};

export { sortEntries };
