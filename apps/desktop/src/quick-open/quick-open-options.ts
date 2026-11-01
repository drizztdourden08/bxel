/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import type { ListedFile } from '../asset-list/asset-list.type';
import { DROP_PALETTE_EXTENSIONS } from '../file-ops/file-ops.constants';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { QUICK_OPEN_SKIPPED } from './quick-open.constants';
import type { QuickOpenOption } from './quick-open.type';

const folderOf = (path: string, roots: readonly string[]): string => {
  const root = roots.map(toSlashes).find((each) => path.toLowerCase().startsWith(`${each.toLowerCase()}/`));
  return root === undefined ? parentOf(path) : parentOf(path).slice(root.length + 1);
};

const quickOpenOptions = (files: readonly ListedFile[], roots: readonly string[]): readonly QuickOpenOption[] =>
  files
    .filter((file) => !QUICK_OPEN_SKIPPED.has(entryKindOf(file.name)) && !DROP_PALETTE_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)))
    .map((file) => {
      const folder = folderOf(toSlashes(file.path), roots);
      return { value: toSlashes(file.path), label: folder === '' ? file.name : `${file.name} (${folder})` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

export { quickOpenOptions };
