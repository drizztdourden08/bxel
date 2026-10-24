/* @layer core @kind logic */
import { z } from 'zod';
import { brushSchema } from './brush-schema';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';
import { symmetrySchema } from './symmetry-schema';

const shapeFields = {
  index: indexSchema,
  filled: z.boolean().default(false),
  brush: brushSchema,
  symmetry: symmetrySchema,
  mask: maskSchema,
};

export { shapeFields };
