/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../stores/useLayerViewStore';

const selectedLayerIds = <Id extends string>(layers: readonly { id: Id }[], activeId: Id): Id[] => {
  const present = layers.filter((layer) => useLayerViewStore.getState().selected.includes(layer.id)).map((layer) => layer.id);
  return present.includes(activeId) ? present : [activeId];
};

export { selectedLayerIds };
