/* @layer core @kind logic */
import { z } from 'zod';
import { CONTOUR_MIN_POINTS, POLYGON_MIN_POINTS } from '../../path/path.constants';
import { pointSchema } from './point-schema';
import { shapeFields } from './shape-fields';

const pixelsShapeSchema = z.discriminatedUnion('shape', [
  z.strictObject({
    shape: z.enum(['line', 'rect', 'ellipse']),
    from: pointSchema,
    to: pointSchema,
    ...shapeFields,
  }),
  z.strictObject({
    shape: z.literal('curve'),
    from: pointSchema,
    control: pointSchema,
    to: pointSchema,
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
    ...shapeFields,
  }),
]);

export { pixelsShapeSchema };
