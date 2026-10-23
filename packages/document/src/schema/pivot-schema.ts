/* @layer core @kind logic */
import { z } from 'zod';

const pivotSchema = z.strictObject({ x2: z.number().int(), y2: z.number().int() });

export { pivotSchema };
