/* @layer renderer-app @kind logic */
import { frameToRgba } from '@bxel/document';
import type { FrameId, PaletteBank, Sprite } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';

const frameImage = (sprite: Sprite, bank: PaletteBank, frameId: FrameId): RgbaImage => ({
  data: new Uint8ClampedArray(frameToRgba(sprite, bank, frameId)),
  width: sprite.width,
  height: sprite.height,
});

export { frameImage };
