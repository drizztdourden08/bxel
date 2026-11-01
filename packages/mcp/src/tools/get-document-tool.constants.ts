/* @layer core @kind constants */
import { z } from 'zod';

const DOCUMENT_INCLUDE_VALUES = ['guides', 'slices', 'presets', 'tags', 'entries', 'tileset'] as const;

const SYMMETRY_REPLY_SCHEMA = z.strictObject({
  x: z.boolean(),
  y: z.boolean(),
  axisX: z.number().int().nullable(),
  axisY: z.number().int().nullable(),
  diagonal: z.boolean(),
  turn: z.boolean(),
});

const GUIDES_SCHEMA = z.strictObject({
  x: z.array(z.number().int()),
  y: z.array(z.number().int()),
});

export { DOCUMENT_INCLUDE_VALUES, GUIDES_SCHEMA, SYMMETRY_REPLY_SCHEMA };
