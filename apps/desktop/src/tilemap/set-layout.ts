/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { TILE_LABEL } from './tilemap.constants';

interface LayoutPatch {
  columns?: number;
  move?: readonly { key: number; to: number }[];
}

const setLayout = (patch: LayoutPatch): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const options = { tileset: tileset.id, ...patch };
  return runDocument(TILE_LABEL.layout, [{ name: COMMAND_NAME.tilesetLayout, targets: null, options }]) !== null;
};

export { setLayout };
