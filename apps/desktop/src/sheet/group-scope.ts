/* @layer renderer-app @kind logic */
import type { FrameSelector, LayerSelector, SpriteId, TargetScope } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import type { FrameScope, LayerScope } from '../stores/sprite-store.type';

const layerSelector = (scope: LayerScope, target: EditorTarget): LayerSelector => {
  if (scope === 'all') return { by: 'all' };
  const layers = scope === 'active' ? [target.layer] : target.sprite.layers.filter((layer) => layer.visible);
  return { by: 'names', names: layers.map((layer) => layer.name) };
};

const frameSelector = (scope: FrameScope, target: EditorTarget): FrameSelector => {
  if (scope === 'all') return { by: 'all' };
  const at = Math.max(0, target.sprite.frames.findIndex((frame) => frame.id === target.frameId));
  return { by: 'range', from: at, to: at };
};

const groupScope = (target: EditorTarget, sprites: readonly SpriteId[], layers: LayerScope, frames: FrameScope): TargetScope => ({
  sprites: [...sprites],
  layers: layerSelector(layers, target),
  frames: frameSelector(frames, target),
});

export { groupScope };
