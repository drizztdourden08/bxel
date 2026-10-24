/* @layer core @kind logic */
import type { Sprite } from '@bxel/document';
import { countUsage } from '../count-usage';

const bankUsage = (sprites: readonly Sprite[]): Uint32Array =>
  countUsage(
    sprites.flatMap((sprite) =>
      Object.values(sprite.cels).map((cel) => ({ pixels: cel.pixels, width: sprite.width, height: sprite.height })),
    ),
  );

export { bankUsage };
