/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';

const pixelsReplaceSchema = z.strictObject({ from: indexSchema, to: indexSchema, mask: maskSchema, allUses: allUsesSchema });

export { pixelsReplaceSchema };
