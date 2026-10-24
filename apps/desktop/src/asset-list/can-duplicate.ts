/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';

const canDuplicate = (row: AssetRow): boolean => !row.loaded || row.kind === 'sprite' || row.kind === 'sheet';

export { canDuplicate };
