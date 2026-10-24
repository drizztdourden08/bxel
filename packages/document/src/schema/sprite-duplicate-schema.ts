/* @layer core @kind logic */
import { z } from 'zod';

const spriteDuplicateSchema = z.strictObject({ name: z.string().optional() });

export { spriteDuplicateSchema };
