/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';

const canExport = (row: AssetRow): boolean => row.loaded && (row.kind === 'sprite' || row.kind === 'sheet' || row.kind === 'tilemap');

export { canExport };
