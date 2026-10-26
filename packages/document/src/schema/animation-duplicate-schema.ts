/* @layer core @kind logic */
import { z } from 'zod';
import { animationRefSchema } from './animation-ref-schema';

const animationDuplicateSchema = z.strictObject({ animation: animationRefSchema, name: z.string().optional() });

export { animationDuplicateSchema };
