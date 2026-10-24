/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';

const canDuplicate = (row: AssetRow): boolean => !row.loaded || (row.kind !== 'image' && row.kind !== 'other');

export { canDuplicate };
