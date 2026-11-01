/* @layer renderer-app @kind logic */
import type { DroppedFile } from '@drizztdourden08/brock-react';
import { isImageFile } from '../image-import/is-image-file';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTileset } from '../tilemap/current-tileset';
import { finishTileDrop } from './finish-tile-drop';
import { imageBlocks } from './image-blocks';
import { TILE_DROP_TEXT } from './tile-drag.constants';

const dropFilesOnTileset = async (files: readonly DroppedFile[]): Promise<void> => {
  const tileset = currentTileset();
  const file = files.map((each) => each.file).find(isImageFile);
  if (!tileset || !file) {
    useNoticeStore.getState().post(tileset ? TILE_DROP_TEXT.noSprites : TILE_DROP_TEXT.noTileset);
    return;
  }
  finishTileDrop(await imageBlocks(file, tileset));
};

export { dropFilesOnTileset };
