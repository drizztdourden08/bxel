/* @layer core @kind logic */
import { z } from 'zod';

const cellRectSchema = z.strictObject({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
});

export { cellRectSchema };
