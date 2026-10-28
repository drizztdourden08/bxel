/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { mapLayerUpdateSchema } from '../../schema/map-layer-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from '../layer/choose-layer-name';
import { withLayerColour } from '../layer/with-layer-colour';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerUpdate = defineCommand({
  name: COMMAND_NAME.mapLayerUpdate,
  scope: 'none',
  schema: mapLayerUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickTilemap(draft, options.tilemap);
    const { layer } = pickMapLayer(tilemap, options.layer);
    const others = tilemap.layers.filter((item) => item.id !== layer.id).map((item) => item.name);
    const name = chooseLayerName(options.name, others, layer.name);
    const visible = options.visible ?? layer.visible;
    const locked = options.locked ?? layer.locked;
    const next = withLayerColour({ ...layer, name, visible, locked }, options.colour);
    if (name === layer.name && visible === layer.visible && locked === layer.locked && next.colour === layer.colour) return;
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: current.layers.map((item) => (item.id === layer.id ? next : item)),
    }));
  },
});

export { mapLayerUpdate };
