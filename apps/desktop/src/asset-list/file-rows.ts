/* @layer renderer-app @kind logic */
import { entryKindOf, isListableName, isNativeAsset } from '@bxel/project';
import { baseName } from '../files/base-name';
import { fileName } from '../files/file-name';
import { toSlashes } from '../workspace/to-slashes';
import type { AssetRow, ListedFile, RowKind } from './asset-list.type';
import { folderLabel } from './folder-label';

const rowKindOf = (name: string): RowKind | null => {
  const kind = entryKindOf(name);
  if (isNativeAsset(name)) return kind as RowKind;
  if (kind === 'project') return null;
  return kind === 'image' ? 'image' : 'other';
};

const fileRow = (file: ListedFile, loaded: ReadonlySet<string>, fallback: string): AssetRow | null => {
  const path = toSlashes(file.path);
  const name = fileName(path);
  const kind = isListableName(name) ? rowKindOf(name) : null;
  if (kind === null || loaded.has(path.toLowerCase())) return null;
  return {
    id: path,
    kind,
    assetId: null,
    name: isNativeAsset(name) ? baseName(path) : name,
    path,
    folder: folderLabel(path, fallback),
    modified: file.modified,
    created: null,
    dirty: false,
    loaded: false,
    usedBy: [],
    preview: null,
  };
};

const fileRows = (files: readonly ListedFile[], loaded: ReadonlySet<string>, fallback: string): readonly AssetRow[] =>
  files.flatMap((file) => {
    const row = fileRow(file, loaded, fallback);
    return row ? [row] : [];
  });

export { fileRows };
