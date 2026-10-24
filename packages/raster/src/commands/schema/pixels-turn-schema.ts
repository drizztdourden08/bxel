/* @layer core @kind logic */
import { z } from 'zod';
import { requiredMaskSchema } from './required-mask-schema';
import { turnDirectionSchema } from './turn-direction-schema';

const pixelsTurnSchema = z.strictObject({ direction: turnDirectionSchema, mask: requiredMaskSchema });

export { pixelsTurnSchema };
