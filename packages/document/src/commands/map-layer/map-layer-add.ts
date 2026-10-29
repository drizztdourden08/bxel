/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateTilemap } from '../../draft/update-tilemap';
import { mapLayerAddSchema } from '../../schema/map-layer-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from '../layer/choose-layer-name';
import { nextLayerName } from '../layer/next-layer-name';
import { buildMapLayer } from '../tilemap/build-map-layer';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickRoomyTilemap } from '../tilemap/pick-roomy-tilemap';

const mapLayerAdd = defineCommand({
  name: COMMAND_NAME.mapLayerAdd,
  scope: 'none',
  schema: mapLayerAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickRoomyTilemap(draft, options.tilemap);
    const names = tilemap.layers.map((layer) => layer.name);
    const name = chooseLayerName(options.name, names, nextLayerName(names));
    const at = options.above ? pickMapLayer(tilemap, options.above).index + 1 : tilemap.layers.length;
    const layer = buildMapLayer(draft.ids, name, tilemap.columns * tilemap.rows);
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: [...current.layers.slice(0, at), layer, ...current.layers.slice(at)],
    }));
    registerRef(draft, input.ref, layer.id);
  },
});

export { mapLayerAdd };
