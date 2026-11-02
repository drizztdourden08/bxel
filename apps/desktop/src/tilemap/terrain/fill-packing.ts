/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { currentTileset } from '../current-tileset';
import { TERRAIN_TEXT } from './terrain.constants';
import type { FillPackingInput } from './fill-packing.type';

const fillPacking = ({ set, packing, start }: FillPackingInput): boolean => {
  const tileset = currentTileset();
  if (!tileset) return false;
  const fill = { set, packing, ...(start === null ? {} : { start }) };
  return runDocument(TERRAIN_TEXT.fillFromLayout, [{ name: COMMAND_NAME.tilesetTerrainSets, targets: null, options: { tileset: tileset.id, fill } }]) !== null;
};

export { fillPacking };
