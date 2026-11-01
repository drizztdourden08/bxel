/* @layer renderer-app @kind logic */
import { assetEntries } from '../sheet-manager/asset-entries';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTileset } from '../tilemap/current-tileset';
import { finishTileDrop } from './finish-tile-drop';
import { spriteBlocks } from './sprite-blocks';
import { TILE_DROP_TEXT } from './tile-drag.constants';
import type { TileDropPayload } from './tile-drag.type';

const dropAssetsOnTileset = (assets: TileDropPayload): void => {
  const tileset = currentTileset();
  if (!tileset) {
    useNoticeStore.getState().post(TILE_DROP_TEXT.noTileset);
    return;
  }
  const ids = assetEntries(assets).flatMap((entry) => (entry.kind === 'sprite' ? [entry.assetId] : []));
  finishTileDrop(spriteBlocks(ids, tileset));
};

export { dropAssetsOnTileset };
