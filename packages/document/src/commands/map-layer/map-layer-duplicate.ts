/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateTilemap } from '../../draft/update-tilemap';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';
import { MAX_MAP_LAYERS } from '../../model/tilemap-limits.constants';
import { mapLayerDuplicateSchema } from '../../schema/map-layer-duplicate-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { chooseLayerName } from '../layer/choose-layer-name';
import { freeName } from '../layer/free-name';
import { COPY_SUFFIX } from '../layer/layer.constants';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerDuplicate = defineCommand({
  name: COMMAND_NAME.mapLayerDuplicate,
  scope: 'none',
  schema: mapLayerDuplicateSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickTilemap(draft, options.tilemap);
    if (tilemap.layers.length >= MAX_MAP_LAYERS) {
      throw fail(ERROR_CODE.LIMIT_REACHED, `A tilemap holds at most ${MAX_MAP_LAYERS} layers.`);
    }
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
