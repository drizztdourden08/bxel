/* @layer core @kind logic */
import { z } from 'zod';

const animFacingSchema = z.enum(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);

export { animFacingSchema };
