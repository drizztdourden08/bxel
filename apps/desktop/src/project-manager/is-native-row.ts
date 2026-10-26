/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';

const isNativeRow = (row: AssetRow): boolean => row.kind !== 'image' && row.kind !== 'other';

export { isNativeRow };
