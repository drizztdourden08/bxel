/* @layer core @kind logic */
import { z } from 'zod';

const spriteDeleteSchema = z.strictObject({ detachAnimations: z.boolean().optional() });

export { spriteDeleteSchema };
