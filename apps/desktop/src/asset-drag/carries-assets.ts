/* @layer renderer-app @kind logic */
import { ASSET_DRAG_TYPE } from './asset-drag.constants';

const carriesAssets = (transfer: DataTransfer): boolean => transfer.types.includes(ASSET_DRAG_TYPE);

export { carriesAssets };
