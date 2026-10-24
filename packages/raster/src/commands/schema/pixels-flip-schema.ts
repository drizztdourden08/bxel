/* @layer core @kind logic */
import { z } from 'zod';
import { flipAxisSchema } from './flip-axis-schema';
import { requiredMaskSchema } from './required-mask-schema';

const pixelsFlipSchema = z.strictObject({ axis: flipAxisSchema, mask: requiredMaskSchema });

export { pixelsFlipSchema };
