/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TilesetId } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { runQuiet } from './run-quiet';
import { TILE_LABEL, TILE_REF, TILEMAP_TEXT } from './tilemap.constants';
import type { TilesetForm } from './tilemap-form.type';

const createTileset = (form: TilesetForm): string | null => {
  const options = { name: form.name, tileWidth: form.width, tileHeight: form.height };
  const result = runQuiet(TILE_LABEL.createTileset, [{ name: COMMAND_NAME.tilesetCreate, targets: null, options, ref: TILE_REF.tileset }]);
  if (!result) return TILEMAP_TEXT.noFile;
  if (!result.ok) return result.error.message;
  useTilemapStore.getState().setTileset(result.created[TILE_REF.tileset] as TilesetId);
  return null;
};

export { createTileset };
