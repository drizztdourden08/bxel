/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { brushSchema } from './brush-schema';
import { indexSchema } from './index-schema';
import { inkSchema } from './ink-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { symmetrySchema } from './symmetry-schema';
import { wrapSchema } from './wrap-schema';

const pixelsPlotSchema = z.strictObject({
  points: z.array(pointSchema).min(1),
  index: indexSchema,
  brush: brushSchema,
  ink: inkSchema,
  symmetry: symmetrySchema,
  mask: maskSchema,
  wrap: wrapSchema,
  allUses: allUsesSchema,
});

export { pixelsPlotSchema };
