/* @layer core @kind logic */
import { z } from 'zod';
import { presetFormatSchema } from './preset-format-schema';
import { presetOwnerSchema } from './preset-owner-schema';

const presetAddSchema = z.strictObject({
  name: z.string(),
  owner: presetOwnerSchema,
  format: presetFormatSchema,
  scale: z.number().int().min(1).max(16).optional(),
  pathTemplate: z.string().min(1).optional(),
  settings: z.record(z.string(), z.json()).optional(),
});

export { presetAddSchema };
