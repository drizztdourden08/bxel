/* @layer core @kind logic */
import { z } from 'zod';

const CURRENT_BRUSH = z.literal('current').describe('The brush of the owner tool now: its tip, size and angle. Pixel perfect is its own field.');

const CURRENT_INK = z.literal('current').describe('The ink of the owner tool now, with the colours the owner has set.');

const withCurrentTool = (schema: z.ZodType): z.ZodType => {
  if (schema instanceof z.ZodUnion) return z.union(schema.options.map((option) => withCurrentTool(option as z.ZodType)));
  if (!(schema instanceof z.ZodObject)) return schema;
  const extras: Record<string, z.ZodType> = {};
  if ('brush' in schema.shape) extras.brush = z.union([CURRENT_BRUSH, schema.shape.brush as z.ZodType]);
  if ('ink' in schema.shape) extras.ink = z.union([CURRENT_INK, schema.shape.ink as z.ZodType]);
  return Object.keys(extras).length === 0 ? schema : schema.extend(extras);
};

export { withCurrentTool };
