/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';

const stepLayer = (direction: 1 | -1): void => {
  const target = currentTarget();
  if (!target) return;
  const { layers } = target.sprite;
  const next = layers[layers.findIndex((layer) => layer.id === target.layerId) + direction];
  if (next) useToolStore.getState().setLayer(next.id);
};

export { stepLayer };
