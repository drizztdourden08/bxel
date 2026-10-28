/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../views/LayerStack/LayerStack.type';
import type { EditorTarget } from './editor.type';
import type { FrameSpread } from './layer-items.type';
import { lockKindOf } from './layer-lock-kind';
import { LAYER_TEXT } from './layer-text.constants';

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

export { layerItems };
