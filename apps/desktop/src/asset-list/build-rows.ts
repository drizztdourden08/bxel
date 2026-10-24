/* @layer renderer-app @kind logic */
import { toSlashes } from '../workspace/to-slashes';
import type { AssetRow, FileStat, RowsInput } from './asset-list.type';
import { fileRows } from './file-rows';
import { nativeRows } from './native-rows';

const buildRows = ({ workspace, artwork, files }: RowsInput): readonly AssetRow[] => {
  const stats = new Map<string, FileStat>(files.map((file) => [toSlashes(file.path).toLowerCase(), file] as const));
  const known = new Set([...workspace.paths.values()].map((path) => path.toLowerCase()));
  return [...nativeRows(workspace, artwork, stats), ...fileRows(files, known, workspace.name)];
};

export { buildRows };
