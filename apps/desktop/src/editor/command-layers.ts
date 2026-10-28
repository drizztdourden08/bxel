/* @layer renderer-app @kind logic */
import type { CommandLayers } from './command-layers.type';
import { layerLockKindOf } from './layer-lock-kind-of-source';
import { selectedLayerIds } from './layer-selection';
import { layerSource } from './layer-source';

const commandLayers = (layerId?: string): CommandLayers | null => {
  const source = layerSource(layerId);
  if (!source) return null;
  const { layers, active, actions } = source;
  const lead = layers.find((layer) => layer.id === active);
  return {
    actions,
    id: active,
    ids: selectedLayerIds(layers, active),
    others: layers.filter((layer) => layer.id !== active).map((layer) => layer.id),
    all: layers.map((layer) => layer.id),
    visible: lead?.visible ?? true,
    lock: layerLockKindOf(lead),
    count: layers.length,
  };
};

export { commandLayers };
