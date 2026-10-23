/* @layer core @kind logic */
import { z } from 'zod';
import { brushSchema } from './brush-schema';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { symmetrySchema } from './symmetry-schema';

const pixelsShapeSchema = z.strictObject({
  shape: z.enum(['line', 'rect', 'ellipse']),
  from: pointSchema,
  to: pointSchema,
  index: indexSchema,
  filled: z.boolean().default(false),
  brush: brushSchema,
  symmetry: symmetrySchema,
  mask: maskSchema,
});

export { pixelsShapeSchema };
