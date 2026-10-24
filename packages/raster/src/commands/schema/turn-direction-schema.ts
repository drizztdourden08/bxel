/* @layer core @kind logic */
import { z } from 'zod';

const turnDirectionSchema = z.enum(['clockwise', 'counter-clockwise', 'half']);

export { turnDirectionSchema };
