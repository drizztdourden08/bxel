/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { PatternId } from '../model/ids.type';
import { MAX_PATTERN_SIDE } from '../model/limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';

const side = z.number().int().min(1).max(MAX_PATTERN_SIDE);

const customPatternSchema = z.object({
  id: brandedIdSchema<PatternId>(ID_PREFIX.pattern),
  name: nameSchema,
  width: side,
  height: side,
  pixels: z.string(),
});

export { customPatternSchema };
