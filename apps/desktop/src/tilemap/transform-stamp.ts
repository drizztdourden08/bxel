/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { composeFlags } from './compose-flags';
import { currentTileset } from './current-tileset';
import { TILEMAP_TEXT } from './tilemap.constants';
import type { StampTransform } from './tilemap.type';

const needsSquare = (op: StampTransform): boolean => op === 'turnRight' || op === 'turnLeft';

const transformStamp = (op: StampTransform): boolean => {
  const store = useTilemapStore.getState();
  const tileset = currentTileset();
  if (needsSquare(op) && tileset && tileset.tileWidth !== tileset.tileHeight) {
    useNoticeStore.getState().post(TILEMAP_TEXT.needSquare);
    return false;
  }
  if (op === 'reset') store.setFlags(NO_FLAGS);
  else if (op === 'flipX' || op === 'flipY') store.setFlags(composeFlags(store.flags, op));
  else {
    const turns = op === 'turnRight' ? 1 : 3;
    store.setFlags(Array.from({ length: turns }).reduce<typeof store.flags>((flags) => composeFlags(flags, 'turn'), store.flags));
  }
  return true;
};

export { transformStamp };
