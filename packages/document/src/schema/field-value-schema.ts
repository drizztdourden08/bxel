/* @layer core @kind logic */
import { z } from 'zod';

const fieldValueSchema = z.union([z.string().max(200), z.number(), z.boolean()]);

export { fieldValueSchema };
