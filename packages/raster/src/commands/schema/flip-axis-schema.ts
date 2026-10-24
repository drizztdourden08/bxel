/* @layer core @kind logic */
import { z } from 'zod';

const flipAxisSchema = z.enum(['horizontal', 'vertical']);

export { flipAxisSchema };
