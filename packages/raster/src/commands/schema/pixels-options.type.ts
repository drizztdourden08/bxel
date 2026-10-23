/* @layer core @kind types */
import type { z } from 'zod';
import type { pixelsEraseSchema } from './pixels-erase-schema';
import type { pixelsFillSchema } from './pixels-fill-schema';
import type { pixelsPaintSchema } from './pixels-paint-schema';
import type { pixelsShapeSchema } from './pixels-shape-schema';

type PixelsPaintOptions = z.output<typeof pixelsPaintSchema>;
type PixelsEraseOptions = z.output<typeof pixelsEraseSchema>;
type PixelsFillOptions = z.output<typeof pixelsFillSchema>;
type PixelsShapeOptions = z.output<typeof pixelsShapeSchema>;

export type { PixelsEraseOptions, PixelsFillOptions, PixelsPaintOptions, PixelsShapeOptions };
