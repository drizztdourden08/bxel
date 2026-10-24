/* @layer core @kind config */
const TRANSFORM_COMMAND = {
  spriteFlip: 'sprite.flip',
  spriteTurn: 'sprite.turn',
  pixelsFlip: 'pixels.flip',
  pixelsTurn: 'pixels.turn',
} as const;

const PIXELS_CLIPPED = 'PIXELS_CLIPPED';
const CEL_ENTITY_PREFIX = 'cel:';

export { CEL_ENTITY_PREFIX, PIXELS_CLIPPED, TRANSFORM_COMMAND };
