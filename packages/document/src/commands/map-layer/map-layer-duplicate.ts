/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateTilemap } from '../../draft/update-tilemap';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';
import { mapLayerDuplicateSchema } from '../../schema/map-layer-duplicate-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from '../layer/choose-layer-name';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickRoomyTilemap } from '../tilemap/pick-roomy-tilemap';

const mapLayerDuplicate = defineCommand({
  name: COMMAND_NAME.mapLayerDuplicate,
  scope: 'none',
  schema: mapLayerDuplicateSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickRoomyTilemap(draft, options.tilemap);
    const { layer, index } = pickMapLayer(tilemap, options.layer);
    const names = tilemap.layers.map((item) => item.name);
    const copy: MapLayer = {
      id: draft.ids.next('tml') as MapLayerId,
      name: chooseLayerName(options.name, names, freeName(names, `${layer.name}${COPY_SUFFIX}`)),
      visible: layer.visible,
      locked: false,
      ...(layer.colour === undefined ? {} : { colour: layer.colour }),
      cells: layer.cells.slice(),
    };
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: [...current.layers.slice(0, index + 1), copy, ...current.layers.slice(index + 1)],
    }));
    registerRef(draft, input.ref, copy.id);
  },
});

export { mapLayerDuplicate };
