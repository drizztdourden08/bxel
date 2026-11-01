/* @layer core @kind logic */
import { z } from 'zod';
import { CURRENT_BRUSH, CURRENT_INK } from './with-current-tool.constants';

const withCurrentTool = (schema: z.ZodType): z.ZodType => {
  if (schema instanceof z.ZodUnion) return z.union(schema.options.map((option) => withCurrentTool(option as z.ZodType)));
  if (!(schema instanceof z.ZodObject)) return schema;
  const extras: Record<string, z.ZodType> = {};
  if ('brush' in schema.shape) extras.brush = z.union([CURRENT_BRUSH, schema.shape.brush as z.ZodType]);
  if ('ink' in schema.shape) extras.ink = z.union([CURRENT_INK, schema.shape.ink as z.ZodType]);
  return Object.keys(extras).length === 0 ? schema : schema.extend(extras);
};

export { withCurrentTool };
