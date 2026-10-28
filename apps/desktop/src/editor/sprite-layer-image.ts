/* @layer renderer-app @kind logic */
import { frameToRgba } from '@bxel/document';
import type { FrameImage } from '../sheet/sheet.type';
import type { SpriteLayerImageInput } from './layer-thumb-image.type';

const spriteLayerImage = ({ sprite, bank, layer, frameId }: SpriteLayerImageInput): FrameImage => ({
  width: sprite.width,
  height: sprite.height,
  rgba: Uint8ClampedArray.from(frameToRgba({ ...sprite, layers: [{ ...layer, visible: true }] }, bank, frameId)),
});

export { spriteLayerImage };
