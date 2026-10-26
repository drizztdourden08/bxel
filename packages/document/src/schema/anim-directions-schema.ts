/* @layer core @kind logic */
import { z } from 'zod';

const animDirectionsSchema = z.enum(['none', 'four', 'eight']);

export { animDirectionsSchema };
