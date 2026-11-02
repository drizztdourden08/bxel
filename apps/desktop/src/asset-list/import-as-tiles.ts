/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { FILE_TEXT } from '../files/files.constants';
import { finishTileDrop } from '../tile-drag/finish-tile-drop';
import { imageBlocks } from '../tile-drag/image-blocks';
import { currentTileset } from '../tilemap/current-tileset';
import { KIND_MENU } from './kind-menu.constants';

const importAsTiles = async (path: string): Promise<void> => {
  const { documents } = getPlatform();
  const tileset = currentTileset();
  if (!documents || !tileset) {
    toast(documents ? KIND_MENU.noTileset : FILE_TEXT.unavailable, { variant: 'info' });
    return;
  }
  const bytes = await documents.read(path).catch(() => null);
  if (bytes === null) {
    toast(FILE_TEXT.openFailed(fileName(path), FILE_TEXT.unreadable), { variant: 'warning' });
    return;
  }
  finishTileDrop(await imageBlocks(new File([new Uint8Array(bytes)], fileName(path)), tileset));
};

export { importAsTiles };
