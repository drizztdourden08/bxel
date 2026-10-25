/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { brushSchema } from './brush-schema';
import { maskSchema } from './mask-schema';
import { pointSchema } from './point-schema';
import { symmetrySchema } from './symmetry-schema';
import { wrapSchema } from './wrap-schema';

const strokeFields = {
  points: z.array(pointSchema).min(1),
  brush: brushSchema,
  pixelPerfect: z.boolean().default(false),
  symmetry: symmetrySchema,
  mask: maskSchema,
  wrap: wrapSchema,
  allUses: allUsesSchema,
};

export { strokeFields };
