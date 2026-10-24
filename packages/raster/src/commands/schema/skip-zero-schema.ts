/* @layer core @kind logic */
import { z } from 'zod';

const skipZeroSchema = z.boolean().default(false);

export { skipZeroSchema };
