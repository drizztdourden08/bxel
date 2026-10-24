/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { composeFlags } from './compose-flags';
import { currentMap } from './current-map';
import { paintSteps } from './paint-steps';
import { runMap } from './run-map';
import { TILE_LABEL, TILEMAP_TEXT } from './tilemap.constants';
import type { FlagOp } from './tilemap.type';
import { turnGroups } from './turn-groups';

const turnCells = (op: FlagOp): boolean => {
  const target = currentMap();
  const store = useTilemapStore.getState();
  if (op === 'turn' && target && target.tileset.tileWidth !== target.tileset.tileHeight) {
    useNoticeStore.getState().post(TILEMAP_TEXT.needSquare);
    return false;
  }
  if (!target || !store.selection) {
    store.setFlags(composeFlags(store.flags, op));
    return true;
  }
  return runMap(TILE_LABEL.flip, paintSteps(target, turnGroups(target, store.selection, op)));
};

export { turnCells };
