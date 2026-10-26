/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { AnimFrameId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';

const animFrameRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<AnimFrameId>(ID_PREFIX.animFrame) }),
  z.strictObject({ by: z.literal('index'), index: z.number().int().min(0) }),
]);

export { animFrameRefSchema };
