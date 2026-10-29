/* @layer renderer-app @kind logic */
import { SPRITE_DRAG_TYPE } from '../sheet/sprite-drag.constants';
import { ASSETS_DRAG_TYPE } from './drag-payload.constants';

const carriesEntries = (transfer: DataTransfer | null): boolean =>
  transfer !== null && (transfer.types.includes(ASSETS_DRAG_TYPE) || transfer.types.includes(SPRITE_DRAG_TYPE));

export { carriesEntries };
