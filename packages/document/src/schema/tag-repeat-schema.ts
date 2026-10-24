/* @layer core @kind logic */
import { z } from 'zod';

const tagRepeatSchema = z.number().int().min(0);

export { tagRepeatSchema };
