/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTileset } from './current-tileset';
import { pickTile } from './pick-tile';
import { TILE_LABEL, TILE_REF, TILEMAP_TEXT } from './tilemap.constants';

const addTile = (): number | null => {
  const tileset = currentTileset();
  if (!tileset) {
    useNoticeStore.getState().post(TILEMAP_TEXT.noTileset);
    return null;
  }
  const step = { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: tileset.id }, ref: TILE_REF.tile };
  const done = runDocument(TILE_LABEL.addTile, [step]);
  const spriteId = done?.created[TILE_REF.tile];
  const key = currentTileset()?.tiles.find((tile) => tile.spriteId === spriteId)?.key ?? null;
  if (key !== null) pickTile(key);
  return key;
};

export { addTile };
