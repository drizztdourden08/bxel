/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import type { CelKey } from '../stores/timeline-store.type';
import { currentSelection } from './current-selection';
import { goToCel } from './go-to-cel';
import { moveCels } from './move-cels';

const dragCels = (from: CelKey, to: CelKey): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const frames = target.sprite.frames.map((frame) => frame.id);
  const layers = target.sprite.layers.map((layer) => layer.id);
  const by = {
    frames: frames.indexOf(to.frameId) - frames.indexOf(from.frameId),
    layers: layers.indexOf(to.layerId) - layers.indexOf(from.layerId),
  };
  if (by.frames === 0 && by.layers === 0) return false;
  const picked = currentSelection(target);
  if (!picked.frames.includes(from.frameId) || !picked.layers.includes(from.layerId)) goToCel(from);
  return moveCels(by);
};

export { dragCels };
