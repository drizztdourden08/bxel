/* @layer core @kind logic */
import { z } from 'zod';
import { platformIdSchema } from './platform-id-schema';

const colorSchema = z.strictObject({ rgb: z.string(), name: z.string().optional() });

const bankSchema = z.strictObject({
  name: z.string(),
  cap: z.number().int(),
  transparent: z.boolean(),
  colors: z.array(colorSchema),
});

const firstSpriteSchema = z.strictObject({
  name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
});

const artworkCreateSchema = z.strictObject({
  name: z.string(),
  platformId: platformIdSchema.optional(),
  bank: bankSchema,
  sprite: firstSpriteSchema.optional(),
});

export { artworkCreateSchema };
