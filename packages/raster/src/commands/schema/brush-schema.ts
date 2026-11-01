/* @layer core @kind logic */
import { z } from 'zod';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN, BRUSH_SPACING_MAX, BRUSH_SPACING_MIN } from '../../brush.constants';

const spacing = z.number().int().min(BRUSH_SPACING_MIN).max(BRUSH_SPACING_MAX).optional();

const plainBrush = z.strictObject({
  shape: z.enum(['square', 'circle', 'line']),
  angle: z.union([z.literal(0), z.literal(45), z.literal(90), z.literal(135)]).optional(),
  size: z.number().int().min(BRUSH_SIZE_MIN).max(BRUSH_SIZE_MAX),
  spacing,
});

const customBrush = z.strictObject({
  shape: z.literal('custom'),
  brushId: z.string().min(1).describe('The id of a saved brush from get_document. Its drawn pixels are the tip; the colour comes from the ink.'),
  size: z.number().int().min(BRUSH_SIZE_MIN).max(BRUSH_SIZE_MAX).default(BRUSH_SIZE_MIN),
  spacing,
});

const brushSchema = z.union([plainBrush, customBrush]).default({ shape: 'square', size: BRUSH_SIZE_MIN });

export { brushSchema };
