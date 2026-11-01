/* @layer renderer-app @kind logic */
import type { DroppedFile } from '@drizztdourden08/brock-react';
import { isImageFile } from '../image-import/is-image-file';
import { assetEntries } from '../sheet-manager/asset-entries';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTileset } from '../tilemap/current-tileset';
import { addTileBlocks } from './add-tile-blocks';
import { imageBlocks } from './image-blocks';
import { spriteBlocks } from './sprite-blocks';
import { TILE_DROP_TEXT } from './tile-drag.constants';
import type { BlocksRead, TileDropPayload } from './tile-drag.type';

const finish = (read: BlocksRead): void => {
  const notice = useNoticeStore.getState();
  if (!read.ok) {
    notice.post(read.reason);
    return;
  }
  const added = addTileBlocks(read.blocks);
  if (added.ok) notice.post(TILE_DROP_TEXT.added(added.count));
  else if (added.reason !== '') notice.post(added.reason);
};

const dropAssetsOnTileset = (assets: TileDropPayload): void => {
  const tileset = currentTileset();
  if (!tileset) {
    useNoticeStore.getState().post(TILE_DROP_TEXT.noTileset);
    return;
  }
  const ids = assetEntries(assets).flatMap((entry) => (entry.kind === 'sprite' ? [entry.assetId] : []));
  finish(spriteBlocks(ids, tileset));
};

const dropFilesOnTileset = async (files: readonly DroppedFile[]): Promise<void> => {
  const tileset = currentTileset();
  const file = files.map((each) => each.file).find(isImageFile);
  if (!tileset || !file) {
    useNoticeStore.getState().post(tileset ? TILE_DROP_TEXT.noSprites : TILE_DROP_TEXT.noTileset);
    return;
  }
  finish(await imageBlocks(file, tileset));
};

export { dropAssetsOnTileset, dropFilesOnTileset };
