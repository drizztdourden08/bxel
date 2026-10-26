/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { fileRows } from '../asset-list/file-rows';
import { NOTHING_LOADED } from './project-manager.constants';
import type { DiskProject } from './project-manager.type';

const diskRows = (disk: DiskProject): readonly AssetRow[] =>
  fileRows(disk.files, NOTHING_LOADED, disk.manifest.name).map((row) => ({ ...row, preview: disk.previews.get(row.path) ?? null }));

export { diskRows };
