/* @layer core @kind logic */
import { z } from 'zod';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN, DEFAULT_BRUSH } from '../../brush.constants';

const brushSchema = z
  .strictObject({
    shape: z.enum(['square', 'circle', 'line']),
    angle: z.union([z.literal(0), z.literal(45), z.literal(90), z.literal(135)]).optional(),
    size: z.number().int().min(BRUSH_SIZE_MIN).max(BRUSH_SIZE_MAX),
  })
  .default(DEFAULT_BRUSH);

export { brushSchema };
