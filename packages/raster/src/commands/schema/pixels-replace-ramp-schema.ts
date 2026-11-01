/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { maskSchema } from './mask-schema';
import { rampNameSchema } from './ramp-name-schema';

const pixelsReplaceRampSchema = z.strictObject({ from: rampNameSchema, to: rampNameSchema, mask: maskSchema, allUses: allUsesSchema });

export { pixelsReplaceRampSchema };
