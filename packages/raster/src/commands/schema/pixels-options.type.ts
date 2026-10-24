/* @layer core @kind types */
import type { z } from 'zod';
import type { pixelsClearSchema } from './pixels-clear-schema';
import type { pixelsEraseSchema } from './pixels-erase-schema';
import type { pixelsFillSchema } from './pixels-fill-schema';
import type { pixelsFlipSchema } from './pixels-flip-schema';
import type { pixelsGradientSchema } from './pixels-gradient-schema';
import type { pixelsMoveSchema } from './pixels-move-schema';
import type { pixelsPaintSchema } from './pixels-paint-schema';
import type { pixelsReplaceSchema } from './pixels-replace-schema';
import type { pixelsRotateSchema } from './pixels-rotate-schema';
import type { pixelsScaleSchema } from './pixels-scale-schema';
import type { pixelsShadeSchema } from './pixels-shade-schema';
import type { pixelsShapeSchema } from './pixels-shape-schema';
import type { pixelsStampSchema } from './pixels-stamp-schema';
import type { pixelsTurnSchema } from './pixels-turn-schema';
import type { spriteFlipSchema } from './sprite-flip-schema';
import type { spriteTurnSchema } from './sprite-turn-schema';

type PixelsPaintOptions = z.output<typeof pixelsPaintSchema>;
type PixelsEraseOptions = z.output<typeof pixelsEraseSchema>;
type PixelsFillOptions = z.output<typeof pixelsFillSchema>;
type PixelsShapeOptions = z.output<typeof pixelsShapeSchema>;
type PixelsFlipOptions = z.output<typeof pixelsFlipSchema>;
type PixelsTurnOptions = z.output<typeof pixelsTurnSchema>;
type PixelsReplaceOptions = z.output<typeof pixelsReplaceSchema>;
type PixelsShadeOptions = z.output<typeof pixelsShadeSchema>;
type PixelsGradientOptions = z.output<typeof pixelsGradientSchema>;
type PixelsStampOptions = z.output<typeof pixelsStampSchema>;
type PixelsClearOptions = z.output<typeof pixelsClearSchema>;
type PixelsMoveOptions = z.output<typeof pixelsMoveSchema>;
type PixelsScaleOptions = z.output<typeof pixelsScaleSchema>;
type PixelsRotateOptions = z.output<typeof pixelsRotateSchema>;
type SpriteFlipOptions = z.output<typeof spriteFlipSchema>;
type SpriteTurnOptions = z.output<typeof spriteTurnSchema>;

export type {
  PixelsClearOptions,
  PixelsEraseOptions,
  PixelsFillOptions,
  PixelsFlipOptions,
  PixelsGradientOptions,
  PixelsMoveOptions,
  PixelsPaintOptions,
  PixelsReplaceOptions,
  PixelsRotateOptions,
  PixelsScaleOptions,
  PixelsShadeOptions,
  PixelsShapeOptions,
  PixelsStampOptions,
  PixelsTurnOptions,
  SpriteFlipOptions,
  SpriteTurnOptions,
};
