/* @layer core @kind logic */
import { z } from 'zod';
import { celSlotSchema } from './cel-slot-schema';

const celTransferSchema = z.strictObject({
  from: celSlotSchema,
  to: celSlotSchema,
  allowLocked: z.boolean().default(false),
});

export { celTransferSchema };
