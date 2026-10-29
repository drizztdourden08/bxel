/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_REGION_SIDE } from '../copy-region.constants';
import { allUsesSchema } from './all-uses-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';

const coordinate = z.number().int().min(0).max(MAX_REGION_SIDE);
const extent = z.number().int().min(1).max(MAX_REGION_SIDE);
const id = z.string().min(1).max(64);

const pixelsCopyRegionSchema = z.strictObject({
  from: z.strictObject({
    sprite: id.describe('The sprite to copy from.'),
    frame: id.describe('The frame of that sprite.'),
    layer: id.describe('The layer of that sprite.'),
    rect: z.strictObject({ x: coordinate, y: coordinate, width: extent, height: extent }),
    mask: maskSchema.describe('Only the selected pixels of the whole source cel are copied. Omit to copy the whole rect.'),
  }),
  at: pointSchema.describe('Where the top left of the copied rect lands in the targeted cels.'),
  remap: z.boolean().default(true).describe('When the two sprites use different palettes, carry each colour to the nearest colour of the target palette.'),
  allUses: allUsesSchema,
});

export { pixelsCopyRegionSchema };
