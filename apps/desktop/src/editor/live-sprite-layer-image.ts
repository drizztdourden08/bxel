/* @layer renderer-app @kind logic */
import { frameToRgba } from '@bxel/document';
import type { Layer, Sprite } from '@bxel/document';
import type { FrameImage } from '../sheet/sheet.type';
import type { Overlay } from './editor.type';
import { LIVE_CEL } from './layer-thumb.constants';
import type { SpriteLayerImageInput } from './layer-thumb-image.type';

const liveSpriteLayerImage = ({ sprite, bank, layer, frameId }: SpriteLayerImageInput, live: Overlay): FrameImage => {
  const celId = layer.cels[frameId];
  const pixels = (celId === undefined ? undefined : sprite.cels[celId]?.pixels)?.slice() ?? new Uint8Array(sprite.width * sprite.height);
  live.indices.forEach((value, at) => {
    if (value !== live.base[at]) pixels[at] = value;
  });
  const drawn: Layer = { ...layer, visible: true, cels: { [frameId]: LIVE_CEL } };
  const withStroke: Sprite = { ...sprite, layers: [drawn], cels: { ...sprite.cels, [LIVE_CEL]: { id: LIVE_CEL, pixels } } };
  return { width: sprite.width, height: sprite.height, rgba: Uint8ClampedArray.from(frameToRgba(withStroke, bank, frameId)) };
};

export { liveSpriteLayerImage };
