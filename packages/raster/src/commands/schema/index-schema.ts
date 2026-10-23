/* @layer core @kind logic */
import { z } from 'zod';

const indexSchema = z.number().int().min(0);

export { indexSchema };
