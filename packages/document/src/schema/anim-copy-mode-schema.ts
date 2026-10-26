/* @layer core @kind logic */
import { z } from 'zod';

const animCopyModeSchema = z.enum(['reference', 'copy']);

export { animCopyModeSchema };
