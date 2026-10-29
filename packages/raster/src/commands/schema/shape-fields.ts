/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { brushSchema } from './brush-schema';
import { indexSchema } from './index-schema';
import { inkSchema } from './ink-schema';
import { maskSchema } from './mask-schema';
import { symmetrySchema } from './symmetry-schema';
import { wrapSchema } from './wrap-schema';

const shapeFields = {
  index: indexSchema,
  filled: z.boolean().default(false),
  fillIndex: indexSchema.optional(),
  brush: brushSchema,
  symmetry: symmetrySchema,
  mask: maskSchema,
  wrap: wrapSchema,
  ink: inkSchema,
  allUses: allUsesSchema,
};

export { shapeFields };
