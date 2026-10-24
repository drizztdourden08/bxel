/* @layer core @kind logic */
import { z } from 'zod';
import { presetRefSchema } from './preset-ref-schema';

const presetRenameSchema = z.strictObject({ preset: presetRefSchema, name: z.string() });

export { presetRenameSchema };
