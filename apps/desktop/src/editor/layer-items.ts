/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../views/LayerStack/LayerStack.type';
import type { LayerScopeChip } from '../stores/layer-view-store.type';
import type { EditorTarget } from './editor.type';
import { frameSprites } from './frame-sprites';
import { lockKindOf } from './layer-lock';
import { LAYER_TEXT } from './layer-text.constants';

interface FrameSpread {
  total: number;
  have: ReadonlyMap<string, number>;
}

/** How many of the animation's frame sprites carry a layer of each name, when a change reaches all frames. */
const frameSpread = (target: EditorTarget, scope: LayerScopeChip): FrameSpread | null => {
  if (!target.animation || scope !== 'all') return null;
  const sprites = frameSprites(target);
  const have = new Map<string, number>();
  for (const sprite of sprites) {
    for (const key of new Set(sprite.layers.map((layer) => layer.name.toLowerCase()))) have.set(key, (have.get(key) ?? 0) + 1);
  }
  return { total: sprites.length, have };
};

/** The rows of the layer list for a sprite, top layer first. */
const layerItems = (target: EditorTarget, spread: FrameSpread | null): LayerRowModel[] => {
  const { sprite, bank, frameId } = target;
  return sprite.layers
    .map((layer) => {
      const have = spread?.have.get(layer.name.toLowerCase()) ?? 0;
      return {
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        mixedVisible: false,
        lock: lockKindOf(layer),
        mixedLock: false,
        colour: layer.colour ?? null,
        note: spread && have < spread.total ? LAYER_TEXT.inFrames(have, spread.total) : null,
        thumb: { kind: 'sprite' as const, sprite, bank, layer, frameId },
      };
    })
    .reverse();
};

export { frameSpread, layerItems };
export type { FrameSpread };
