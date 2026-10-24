/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { requiredMaskSchema } from './required-mask-schema';
import { turnDirectionSchema } from './turn-direction-schema';

const pixelsTurnSchema = z.strictObject({ direction: turnDirectionSchema, mask: requiredMaskSchema, allUses: allUsesSchema });

export { pixelsTurnSchema };
