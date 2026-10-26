/* @layer core @kind logic */
import type { Frame, Sprite } from '../../model/sprite.type';

const frameSignature = (sprite: Sprite, frame: Frame): string =>
  sprite.layers.map((layer) => layer.cels[frame.id] ?? '').join('|');

export { frameSignature };
