/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TilemapId } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { runQuiet } from './run-quiet';
import { TILE_LABEL, TILE_REF, TILEMAP_TEXT } from './tilemap.constants';
import type { TilemapForm } from './tilemap-form.type';

const createTilemap = (form: TilemapForm): string | null => {
  if (form.tilesetId === null) return TILEMAP_TEXT.noTileset;
  const options = { name: form.name, tileset: form.tilesetId, columns: form.columns, rows: form.rows };
  const result = runQuiet(TILE_LABEL.createTilemap, [{ name: COMMAND_NAME.tilemapCreate, targets: null, options, ref: TILE_REF.tilemap }]);
  if (!result) return TILEMAP_TEXT.noFile;
  if (!result.ok) return result.error.message;
  useTilemapStore.getState().setMap(result.created[TILE_REF.tilemap] as TilemapId);
  return null;
};

export { createTilemap };
