/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import type { EntryKind, ListedEntry } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { listFolderEntries } from '../../project/list-folder-entries';

type TreeEntry = { readonly entry: ListedEntry; readonly dir: string; readonly path: string; readonly depth: number };

type Tree = { readonly entries: readonly TreeEntry[]; readonly skipped: number; readonly cut: boolean };

type Walk = { readonly documents: DocumentsPort; readonly kinds: readonly EntryKind[]; readonly depth: number };

const TREE_CAP = 5000;

const walkFolder = async (walk: Walk, dir: string, base: string, level: number, found: { entries: TreeEntry[]; skipped: number; cut: boolean }): Promise<void> => {
  const listing = await listFolderEntries(walk.documents, dir, { kinds: walk.kinds, offset: 0, limit: TREE_CAP });
  found.skipped += listing.skipped;
  found.cut ||= listing.cut || listing.truncated;
  for (const entry of listing.entries) {
    if (found.entries.length >= TREE_CAP) {
      found.cut = true;
      return;
    }
    const path = base === '' ? entry.name : `${base}/${entry.name}`;
    found.entries.push({ entry, dir, path, depth: level });
    const inside = entry.kind === 'folder' && level < walk.depth ? joinInside(dir, entry.name) : null;
    if (inside?.ok) await walkFolder(walk, inside.value, path, level + 1, found);
  }
};

const listFileTree = async (walk: Walk, dir: string): Promise<Tree> => {
  const found = { entries: [] as TreeEntry[], skipped: 0, cut: false };
  await walkFolder(walk, dir, '', 1, found);
  return found;
};

export type { Tree, TreeEntry };
export { listFileTree };
