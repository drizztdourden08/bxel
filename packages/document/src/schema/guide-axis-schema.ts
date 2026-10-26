/* @layer core @kind logic */
import { z } from 'zod';

const guideAxisSchema = z.enum(['x', 'y']);

export { guideAxisSchema };
