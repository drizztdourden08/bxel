/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../stores/useLayerViewStore';

/**
 * The layers a command acts on: the rows picked in the list, or just the active layer.
 * A pick that no longer holds the active layer, or a layer that is gone, falls back to the active layer.
 */
const selectedLayerIds = <Id extends string>(layers: readonly { id: Id }[], activeId: Id): Id[] => {
  const present = layers.filter((layer) => useLayerViewStore.getState().selected.includes(layer.id)).map((layer) => layer.id);
  return present.includes(activeId) ? present : [activeId];
};

export { selectedLayerIds };
