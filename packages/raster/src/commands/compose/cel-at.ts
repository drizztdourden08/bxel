/* @layer core @kind logic */
import type { Cel, FrameId, Layer, Sprite } from '@bxel/document';

const celAt = (sprite: Sprite, layer: Layer, frameId: FrameId | undefined): Cel | undefined => {
  const id = frameId === undefined ? undefined : layer.cels[frameId];
  return id === undefined ? undefined : sprite.cels[id];
};

export { celAt };
