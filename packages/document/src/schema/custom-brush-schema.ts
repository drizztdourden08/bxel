/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BrushId } from '../model/ids.type';
import { MAX_BRUSH_SIDE } from '../model/limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';

const side = z.number().int().min(1).max(MAX_BRUSH_SIDE);

const customBrushSchema = z.object({
  id: brandedIdSchema<BrushId>(ID_PREFIX.brush),
  name: nameSchema,
  width: side,
  height: side,
  pixels: z.string(),
});

export { customBrushSchema };
