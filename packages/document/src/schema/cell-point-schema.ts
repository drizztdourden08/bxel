/* @layer core @kind logic */
import { z } from 'zod';

const cellPointSchema = z.strictObject({ x: z.number().int().min(0), y: z.number().int().min(0) });

export { cellPointSchema };
