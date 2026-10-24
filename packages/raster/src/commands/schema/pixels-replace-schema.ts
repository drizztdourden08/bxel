/* @layer core @kind logic */
import { z } from 'zod';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';

const pixelsReplaceSchema = z.strictObject({ from: indexSchema, to: indexSchema, mask: maskSchema });

export { pixelsReplaceSchema };
