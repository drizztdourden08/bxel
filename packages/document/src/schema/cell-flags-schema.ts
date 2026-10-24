/* @layer core @kind logic */
import { z } from 'zod';
import { NO_FLAGS } from '../tilemap/cell.constants';

const cellFlagsSchema = z
  .strictObject({
    flipX: z.boolean().default(false),
    flipY: z.boolean().default(false),
    diagonal: z.boolean().default(false),
  })
  .default(NO_FLAGS);

export { cellFlagsSchema };
