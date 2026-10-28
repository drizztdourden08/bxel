/* @layer renderer-app @kind logic */
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import { natural } from './natural';
import type { Compare, FileEntry, SortKey } from './project-browser.type';

const byName: Compare = (left, right) => natural(left.row.name, right.row.name) || natural(left.row.path, right.row.path);

const pixels = (entry: FileEntry): number => (entry.facts.width ?? 0) * (entry.facts.height ?? 0);

const compareEntries = (key: SortKey): Compare => {
  const table: Record<SortKey, Compare> = {
    name: byName,
    kind: (left, right) => KIND_ORDER.indexOf(left.row.kind) - KIND_ORDER.indexOf(right.row.kind) || byName(left, right),
    modified: (left, right) => left.row.modified - right.row.modified || byName(left, right),
    folder: (left, right) => natural(left.row.folder, right.row.folder) || byName(left, right),
    size: (left, right) => pixels(left) - pixels(right) || byName(left, right),
    frames: (left, right) => (left.facts.frames ?? 0) - (right.facts.frames ?? 0) || byName(left, right),
    usedBy: (left, right) => left.facts.usedBy.length - right.facts.usedBy.length || byName(left, right),
  };
  return table[key];
};

export { compareEntries };
