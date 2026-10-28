/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { inkSchema } from './ink-schema';
import { maskSchema } from './mask-schema';
import { patchSchema } from './patch-schema';
import { pointSchema } from './point-schema';
import { symmetrySchema } from './symmetry-schema';
import { wrapSchema } from './wrap-schema';

const pixelsStampSchema = z
  .strictObject({
    patch: patchSchema.optional(),
    brushId: z.string().min(1).optional(),
    points: z.array(pointSchema).min(1),
    anchor: pointSchema.optional(),
    skipZero: z.boolean().default(true),
    flipX: z.boolean().default(false),
    flipY: z.boolean().default(false),
    turn: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]).default(0),
    symmetry: symmetrySchema,
    ink: inkSchema,
    mask: maskSchema,
    wrap: wrapSchema,
    allUses: allUsesSchema,
  })
  .refine((options) => (options.patch === undefined) !== (options.brushId === undefined), {
    message: 'Give either a patch or the id of a saved brush.',
    path: ['patch'],
  });

export { pixelsStampSchema };
