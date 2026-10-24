/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SliceId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';

const sliceRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<SliceId>(ID_PREFIX.slice) }),
  z.strictObject({ by: z.literal('name'), name: z.string().min(1) }),
]);

export { sliceRefSchema };
