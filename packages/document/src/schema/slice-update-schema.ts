/* @layer core @kind logic */
import { z } from 'zod';
import { pivotSchema } from './pivot-schema';
import { rectSchema } from './rect-schema';
import { sliceRefSchema } from './slice-ref-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const sliceUpdateSchema = z
  .strictObject({
    slice: sliceRefSchema,
    name: z.string().optional(),
    rect: rectSchema.optional(),
    pivot: pivotSchema.nullable().optional(),
    center: rectSchema.nullable().optional(),
    colour: tagColourOptionSchema.nullable().optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.rect !== undefined || value.pivot !== undefined || value.center !== undefined || value.colour !== undefined,
    { message: 'Give a name, rect, pivot, center or colour.' },
  );

export { sliceUpdateSchema };
