/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { addTileBlocks } from './add-tile-blocks';
import { TILE_DROP_TEXT } from './tile-drag.constants';
import type { BlocksRead } from './tile-drag.type';

const finishTileDrop = (read: BlocksRead): void => {
  const notice = useNoticeStore.getState();
  if (!read.ok) {
    notice.post(read.reason);
    return;
  }
  const added = addTileBlocks(read.blocks);
  if (added.ok) notice.post(TILE_DROP_TEXT.added(added.count));
  else if (added.reason !== '') notice.post(added.reason);
};

export { finishTileDrop };
