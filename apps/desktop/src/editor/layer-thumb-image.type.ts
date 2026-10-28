/* @layer renderer-app @kind types */
import type { FrameId, Layer, PaletteBank, Sprite } from '@bxel/document';

interface SpriteLayerImageInput {
  sprite: Sprite;
  bank: PaletteBank;
  layer: Layer;
  frameId: FrameId;
}

export type { SpriteLayerImageInput };
