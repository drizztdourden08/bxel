/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../stores/useLayerViewStore';

interface TreeLayer<Id extends string> {
  id: Id;
  parentId?: string;
}

const sits = <Id extends string>(layers: readonly TreeLayer<Id>[], id: string, groupId: string): boolean => {
  const byId = new Map<string, TreeLayer<Id>>(layers.map((layer) => [layer.id, layer]));
  const seen = new Set<string>();
  let parent = byId.get(id)?.parentId;
  while (parent !== undefined && !seen.has(parent)) {
    if (parent === groupId) return true;
    seen.add(parent);
    parent = byId.get(parent)?.parentId;
  }
  return false;
};

const selectedLayerIds = <Id extends string>(layers: readonly TreeLayer<Id>[], activeId: Id): Id[] => {
  const present = layers.filter((layer) => useLayerViewStore.getState().selected.includes(layer.id)).map((layer) => layer.id);
  return present.some((id) => id === activeId || sits(layers, activeId, id)) ? present : [activeId];
};

export { selectedLayerIds };
