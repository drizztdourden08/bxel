/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { FrameId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';

const frameRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<FrameId>(ID_PREFIX.frame) }),
  z.strictObject({ by: z.literal('index'), index: z.number().int().min(0) }),
]);

export { frameRefSchema };
