/* @layer core @kind logic */
import { z } from 'zod';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN, DEFAULT_BRUSH } from '../../brush.constants';

const brushSchema = z
  .strictObject({
    shape: z.enum(['square', 'circle']),
    size: z.number().int().min(BRUSH_SIZE_MIN).max(BRUSH_SIZE_MAX),
  })
  .default(DEFAULT_BRUSH);

export { brushSchema };
