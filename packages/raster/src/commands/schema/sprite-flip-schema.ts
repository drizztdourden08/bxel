/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { flipAxisSchema } from './flip-axis-schema';

const spriteFlipSchema = z.strictObject({ axis: flipAxisSchema, allUses: allUsesSchema });

export { spriteFlipSchema };
