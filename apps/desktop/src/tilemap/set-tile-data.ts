/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { FieldValue, TileTurns } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

interface TileDataPatch {
  type?: string | null;
  probability?: number | null;
  turns?: TileTurns | null;
  data?: Readonly<Record<string, FieldValue | null>>;
}

const setTileData = (keys: readonly number[], patch: TileDataPatch, label: string = TILE_LABEL.tileData): boolean => {
  const tileset = currentTileset();
  if (!tileset || keys.length === 0) return false;
  const options = { tileset: tileset.id, keys, ...patch };
  return runDocument(label, [{ name: COMMAND_NAME.tileData, targets: null, options }]) !== null;
};

export type { TileDataPatch };
export { setTileData };
