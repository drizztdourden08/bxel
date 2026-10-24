/* @layer core @kind logic */
import { z } from 'zod';

const createdSchema = z.number().int().min(0);

export { createdSchema };
