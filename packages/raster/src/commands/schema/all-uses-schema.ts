/* @layer core @kind logic */
import { z } from 'zod';

const allUsesSchema = z.boolean().default(false);

export { allUsesSchema };
