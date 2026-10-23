/* @layer core @kind types */
import type { z } from 'zod';
import type { pixelsEraseSchema } from './pixels-erase-schema';
import type { pixelsFillSchema } from './pixels-fill-schema';
import type { pixelsFlipSchema } from './pixels-flip-schema';
import type { pixelsPaintSchema } from './pixels-paint-schema';
import type { pixelsShapeSchema } from './pixels-shape-schema';
import type { pixelsTurnSchema } from './pixels-turn-schema';
import type { spriteFlipSchema } from './sprite-flip-schema';
import type { spriteTurnSchema } from './sprite-turn-schema';

type PixelsPaintOptions = z.output<typeof pixelsPaintSchema>;
type PixelsEraseOptions = z.output<typeof pixelsEraseSchema>;
type PixelsFillOptions = z.output<typeof pixelsFillSchema>;
type PixelsShapeOptions = z.output<typeof pixelsShapeSchema>;
type PixelsFlipOptions = z.output<typeof pixelsFlipSchema>;
type PixelsTurnOptions = z.output<typeof pixelsTurnSchema>;
type SpriteFlipOptions = z.output<typeof spriteFlipSchema>;
type SpriteTurnOptions = z.output<typeof spriteTurnSchema>;

export type {
  PixelsEraseOptions,
  PixelsFillOptions,
  PixelsFlipOptions,
  PixelsPaintOptions,
  PixelsShapeOptions,
  PixelsTurnOptions,
  SpriteFlipOptions,
  SpriteTurnOptions,
};
