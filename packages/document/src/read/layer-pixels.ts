/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { Layer, Sprite } from '../model/sprite.type';

const layerPixels = (sprite: Sprite, layer: Layer, frameId: FrameId): Uint8Array | undefined => {
  const celId = layer.cels[frameId];
  if (celId === undefined) return undefined;
  return sprite.cels[celId]?.pixels;
};

export { layerPixels };
