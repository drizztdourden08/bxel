/* @layer core @kind constants */
import { z } from 'zod';

const SYMMETRY_REPLY_SCHEMA = z.strictObject({
  x: z.boolean(),
  y: z.boolean(),
  axisX: z.number().int().nullable(),
  axisY: z.number().int().nullable(),
  diagonal: z.boolean(),
  turn: z.boolean(),
});

export { SYMMETRY_REPLY_SCHEMA };
