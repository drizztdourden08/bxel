/* @layer core @kind config */
const TRANSFORM_COMMAND = {
  spriteFlip: 'sprite.flip',
  spriteTurn: 'sprite.turn',
  spriteResize: 'sprite.resize',
  spriteTrim: 'sprite.trim',
  spriteCrop: 'sprite.crop',
  pixelsFlip: 'pixels.flip',
  pixelsTurn: 'pixels.turn',
} as const;

const PIXELS_CLIPPED = 'PIXELS_CLIPPED';

export { PIXELS_CLIPPED, TRANSFORM_COMMAND };
