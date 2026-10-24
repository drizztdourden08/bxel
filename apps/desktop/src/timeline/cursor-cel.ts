/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import type { CelKey } from '../stores/timeline-store.type';
import { clampIndex } from './clamp-index';
import type { CelMove } from './timeline.type';

const cursorCel = (target: EditorTarget, by: CelMove): CelKey | null => {
  const { frames, layers } = target.sprite;
  const frame = frames[clampIndex(frames.findIndex((each) => each.id === target.frameId) + by.frames, frames.length)];
  const layer = layers[clampIndex(layers.findIndex((each) => each.id === target.layerId) + by.layers, layers.length)];
  return frame && layer ? { layerId: layer.id, frameId: frame.id } : null;
};

export { cursorCel };
