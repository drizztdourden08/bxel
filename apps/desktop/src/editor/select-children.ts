/* @layer renderer-app @kind logic */
import { descendantIds } from '@bxel/document';
import { useLayerViewStore } from '../stores/useLayerViewStore';
import type { PlanItem } from './flatten-group-plan.type';

const selectChildren = (layers: readonly PlanItem[], id: string): void => {
  const inside = descendantIds(layers, id);
  const ids = layers.filter((layer) => inside.has(layer.id)).map((layer) => layer.id);
  const [first] = ids;
  if (first !== undefined) useLayerViewStore.getState().select(ids, first);
};

export { selectChildren };
