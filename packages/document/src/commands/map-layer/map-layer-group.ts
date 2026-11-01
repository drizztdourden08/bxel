/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateTilemap } from '../../draft/update-tilemap';
import { groupItems } from '../../layer-tree/group-items';
import { outermostItems } from '../../layer-tree/outermost-items';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';
import { mapLayerGroupSchema } from '../../schema/map-layer-group-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { chooseLayerName } from '../layer/choose-layer-name';
import { freeName } from '../layer/free-name';
import { GROUP_NAME } from '../layer/layer.constants';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';
import { checkMapTree } from './check-map-tree';

const mapLayerGroup = defineCommand({
  name: COMMAND_NAME.mapLayerGroup,
  scope: 'none',
  schema: mapLayerGroupSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickTilemap(draft, options.tilemap);
    const members = outermostItems(tilemap.layers, options.layers.map((ref) => pickMapLayer(tilemap, ref).layer));
    if (new Set(members.map((layer) => layer.parentId)).size > 1) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The layers of one group share one group today, or none.', { path: 'options.layers' });
    }
    const names = tilemap.layers.map((layer) => layer.name);
    const parentId = members[0]?.parentId;
    const group: MapLayer = {
      id: draft.ids.next('tml') as MapLayerId,
      name: chooseLayerName(options.name, names, freeName(names, GROUP_NAME)),
      visible: true,
      locked: false,
      kind: 'group',
      ...(parentId ? { parentId } : {}),
      cells: new Uint32Array(tilemap.columns * tilemap.rows),
    };
    const layers = groupItems(tilemap.layers, new Set(members.map((layer) => layer.id)), group);
    checkMapTree(layers);
    updateTilemap(draft, tilemap.id, (current) => ({ ...current, layers }));
    registerRef(draft, input.ref, group.id);
  },
});

export { mapLayerGroup };
