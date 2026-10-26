/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { TagId } from '../model/ids.type';
import { animFacingSchema } from './anim-facing-schema';
import { brandedIdSchema } from './branded-id-schema';

const animTagRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<TagId>(ID_PREFIX.tag) }),
  z.strictObject({ by: z.literal('name'), name: z.string().min(1), facing: animFacingSchema.optional() }),
]);

export { animTagRefSchema };
