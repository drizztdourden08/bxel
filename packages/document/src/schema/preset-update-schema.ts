/* @layer core @kind logic */
import { z } from 'zod';
import { presetFormatSchema } from './preset-format-schema';
import { presetRefSchema } from './preset-ref-schema';

const presetUpdateSchema = z
  .strictObject({
    preset: presetRefSchema,
    format: presetFormatSchema.optional(),
    scale: z.number().int().min(1).max(16).optional(),
    pathTemplate: z.string().min(1).optional(),
    settings: z.record(z.string(), z.json()).optional(),
  })
  .refine(
    (value) => value.format !== undefined || value.scale !== undefined || value.pathTemplate !== undefined || value.settings !== undefined,
    { message: 'Give a format, scale, path template or settings.' },
  );

export { presetUpdateSchema };
