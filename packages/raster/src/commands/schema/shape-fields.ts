/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { brushSchema } from './brush-schema';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';
import { symmetrySchema } from './symmetry-schema';
import { wrapSchema } from './wrap-schema';

const shapeFields = {
  index: indexSchema,
  filled: z.boolean().default(false),
  brush: brushSchema,
  symmetry: symmetrySchema,
  mask: maskSchema,
  wrap: wrapSchema,
  allUses: allUsesSchema,
};

export { shapeFields };
