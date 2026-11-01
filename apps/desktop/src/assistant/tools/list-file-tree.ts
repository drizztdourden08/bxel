/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';
import { listFolderEntries } from '../../project/list-folder-entries';
import { TREE_CAP } from './list-file-tree.constants';
import type { Found, FolderAt, Tree, Walk } from './list-file-tree.type';

const walkFolder = async (walk: Walk, at: FolderAt, found: Found): Promise<void> => {
  const { dir, base, level } = at;
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
    if (inside?.ok) await walkFolder(walk, { dir: inside.value, base: path, level: level + 1 }, found);
  }
};

const listFileTree = async (walk: Walk, dir: string): Promise<Tree> => {
  const found: Found = { entries: [], skipped: 0, cut: false };
  await walkFolder(walk, { dir, base: '', level: 1 }, found);
  return found;
};

export { listFileTree };
