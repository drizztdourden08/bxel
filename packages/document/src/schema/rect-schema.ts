/* @layer core @kind logic */
import { z } from 'zod';
import { pointSchema } from './point-schema';

const rectSchema = pointSchema.extend({ width: z.number().int().min(0), height: z.number().int().min(0) });

export { rectSchema };
