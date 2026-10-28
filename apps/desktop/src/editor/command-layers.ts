/* @layer renderer-app @kind logic */
import { inMapPlace } from '../tilemap/in-map-place';
import { currentMap } from '../tilemap/current-map';
import { currentTarget } from './current-target';
import type { LayerActions } from './layer-actions.type';
import { spriteLayerActions } from './layer-actions';
import { lockKindOf } from './layer-lock';
import { selectedLayerIds } from './layer-selection';
import { mapLayerActions } from '../tilemap/map-layer-actions';
import type { CommandLayers } from './command-layers.type';

/**
 * The layers a layer command acts on, whichever list is open. A command from a row menu names its row;
 * when that row is one of several picked rows, the command acts on all of them.
 */
const commandLayers = (layerId?: string): CommandLayers | null => {
  const placing = inMapPlace();
  const layers = placing ? currentMap()?.tilemap.layers : currentTarget()?.sprite.layers;
  const active = layerId ?? (placing ? currentMap()?.layer.id : currentTarget()?.layerId);
  if (!layers || active === undefined) return null;
  const actions: LayerActions = placing ? mapLayerActions : spriteLayerActions;
  const ids: string[] = selectedLayerIds(layers, active);
  const lead = layers.find((layer) => layer.id === active);
  const others = layers.filter((layer) => layer.id !== active).map((layer) => layer.id);
  return {
    actions,
    id: active,
    ids,
    others,
    all: layers.map((layer) => layer.id),
    visible: lead?.visible ?? true,
    lock: lead ? lockKindOf(lead) : 'none',
    count: layers.length,
  };
};

export { commandLayers };
