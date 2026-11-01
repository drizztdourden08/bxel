/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateTilemap } from '../../draft/update-tilemap';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';
import { blockOf } from '../../layer-tree/block-of';
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
    const block = blockOf(tilemap.layers, layer.id);
    const items = tilemap.layers.filter((item) => block.has(item.id));
    const fresh = new Map(items.map((item) => [item.id, draft.ids.next('tml') as MapLayerId]));
    const copies = items.map((item): MapLayer => {
      const top = item.id === layer.id;
      const name = top ? chooseLayerName(options.name, names, freeName(names, `${layer.name}${COPY_SUFFIX}`)) : freeName(names, `${item.name}${COPY_SUFFIX}`);
      names.push(name);
      const parentId = top ? item.parentId : fresh.get(item.parentId ?? item.id);
      const copy = { ...item, id: fresh.get(item.id) ?? item.id, name, locked: false, cells: item.cells.slice() };
      return parentId === undefined ? copy : { ...copy, parentId };
    });
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: [...current.layers.slice(0, index + 1), ...copies, ...current.layers.slice(index + 1)],
    }));
    const added = copies.at(-1);
    if (added) registerRef(draft, input.ref, added.id);
  },
});

export { mapLayerDuplicate };
