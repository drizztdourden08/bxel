/* @layer core @kind logic */
import { z } from 'zod';
import { WIRE_MASK_SCHEMA } from './wire-mask.constants';

const maskOf = (field: z.ZodType): z.ZodType => (field.safeParse(undefined).success ? WIRE_MASK_SCHEMA.optional() : WIRE_MASK_SCHEMA);

const withWireMask = (schema: z.ZodType): z.ZodType => {
  if (schema instanceof z.ZodDiscriminatedUnion) return z.union(schema.options.map((option) => withWireMask(option as z.ZodType)));
  if (schema instanceof z.ZodObject && 'mask' in schema.shape) return schema.extend({ mask: maskOf(schema.shape.mask as z.ZodType) });
  return schema;
};

export { withWireMask };
