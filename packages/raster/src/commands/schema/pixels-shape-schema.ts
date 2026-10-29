/* @layer core @kind logic */
import { z } from 'zod';
import { RADIUS_MAX } from '../../rounded-rect';
import { CONTOUR_MIN_POINTS, POLYGON_MIN_POINTS } from '../../path/path.constants';
import { pointSchema } from './point-schema';
import { shapeFields } from './shape-fields';

const pixelsShapeSchema = z.discriminatedUnion('shape', [
  z.strictObject({
    shape: z.enum(['line', 'rect', 'ellipse']),
    from: pointSchema,
    to: pointSchema,
    radius: z.number().int().min(0).max(RADIUS_MAX).optional(),
    evenSteps: z.boolean().optional(),
    ...shapeFields,
  }),
  z.strictObject({
    shape: z.literal('curve'),
    from: pointSchema,
    control: pointSchema,
    control2: pointSchema.optional(),
    to: pointSchema,
    pixelPerfect: z.boolean().optional(),
    ...shapeFields,
  }),
  z.strictObject({
    shape: z.literal('polygon'),
    points: z.array(pointSchema).min(POLYGON_MIN_POINTS),
    ...shapeFields,
  }),
  z.strictObject({
    shape: z.literal('contour'),
    points: z.array(pointSchema).min(CONTOUR_MIN_POINTS),
    pixelPerfect: z.boolean().optional(),
    ...shapeFields,
  }),
]);

export { pixelsShapeSchema };
