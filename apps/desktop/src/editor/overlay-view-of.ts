/* @layer renderer-app @kind logic */
import { frameToRgba, viewAlpha } from '@bxel/document';
import type { Layer, Sprite } from '@bxel/document';
import { useLayerViewStore } from '../stores/useLayerViewStore';
import type { EditorTarget } from './editor.type';
import { frameView } from './frame-view';
import type { OverlayView } from './overlay-view.type';

const without = (sprite: Sprite, hide: (index: number) => boolean): Sprite => ({
  ...sprite,
  layers: sprite.layers.map((layer: Layer, index) => (hide(index) ? { ...layer, visible: false } : layer)),
});

const overlayViewOf = (target: EditorTarget): OverlayView | undefined => {
  const { sprite, bank, frameId, layerId } = target;
  const at = sprite.layers.findIndex((layer) => layer.id === layerId);
  const layer = sprite.layers[at];
  const view = frameView(sprite, useLayerViewStore.getState().highlight ? layerId : null);
  if (!layer || !view) return undefined;
  const alpha = view.alpha ? view.alpha(layer) : viewAlpha(sprite.layers, layer);
  if (alpha >= 1) return undefined;
  return {
    alpha,
    below: frameToRgba(without(sprite, (index) => index >= at), bank, frameId, view),
    above: frameToRgba(without(sprite, (index) => index <= at), bank, frameId, view),
    committed: frameToRgba(sprite, bank, frameId, view),
  };
};

export { overlayViewOf };
