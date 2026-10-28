/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { mapLayerMergeSchema } from '../../schema/map-layer-merge-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerMerge = defineCommand({
  name: COMMAND_NAME.mapLayerMerge,
  scope: 'none',
  schema: mapLayerMergeSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickTilemap(draft, options.tilemap);
    const { layer, index } = pickMapLayer(tilemap, options.layer);
    const below = tilemap.layers[index - 1];
    if (!below) throw fail(ERROR_CODE.NO_LAYER_BELOW, `Map layer "${layer.name}" is the bottom layer, so there is nothing to merge into.`);
    if ((layer.locked || below.locked) && options.allowLocked !== true) {
      const locked = layer.locked ? layer : below;
      throw fail(ERROR_CODE.LAYER_LOCKED, `Map layer "${locked.name}" is locked. Pass allowLocked to merge it.`);
    }
    const cells = below.cells.slice();
    layer.cells.forEach((cell, position) => {
      if (cell !== 0) cells[position] = cell;
    });
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: current.layers.filter((item) => item.id !== layer.id).map((item) => (item.id === below.id ? { ...item, cells } : item)),
    }));
  },
});

export { mapLayerMerge };
