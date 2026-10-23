/* @layer core @kind logic */
import { z } from 'zod';

const pointSchema = z.object({ x: z.number().int(), y: z.number().int() });

export { pointSchema };
