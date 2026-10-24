/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { maskSchema } from './mask-schema';

const pixelsClearSchema = z.strictObject({ mask: maskSchema, allUses: allUsesSchema });

export { pixelsClearSchema };
