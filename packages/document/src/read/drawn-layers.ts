/* @layer core @kind logic */
import { clipPixels } from '../pixels/clip-pixels';
import { shownInTree } from '../layer-tree/shown-in-tree';
import type { FrameId, LayerId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';
import { clipBaseIndex } from './clip-base-index';
import type { DrawnLayer } from './drawn-layers.type';
import { layerKindOf } from './layer-kind-of';
import { layerPixels } from './layer-pixels';

const drawable = (sprite: Sprite, layer: Layer, only: ReadonlySet<LayerId> | undefined): boolean =>
  layerKindOf(layer) === 'pixel' && shownInTree(sprite.layers, layer) && (only === undefined || only.has(layer.id));

const drawnLayers = (sprite: Sprite, frameId: FrameId, only?: ReadonlySet<LayerId>): DrawnLayer[] => {
  const drawn: DrawnLayer[] = [];
  sprite.layers.forEach((layer, index) => {
    if (!drawable(sprite, layer, only)) return;
    const pixels = layerPixels(sprite, layer, frameId);
    if (!pixels) return;
    const baseAt = clipBaseIndex(sprite.layers, index);
    const base = sprite.layers[baseAt];
    if (baseAt < 0 || !base) {
      drawn.push({ layer, pixels });
      return;
    }
    drawn.push({ layer, pixels: clipPixels(pixels, drawable(sprite, base, only) ? layerPixels(sprite, base, frameId) : undefined) });
  });
  return drawn;
};

export { drawnLayers };
