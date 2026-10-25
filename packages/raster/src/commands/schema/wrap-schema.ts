/* @layer core @kind logic */
import { z } from 'zod';

const wrapSchema = z.strictObject({ x: z.boolean().optional(), y: z.boolean().optional() }).default({});

export { wrapSchema };
