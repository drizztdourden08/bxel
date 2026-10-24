/* @layer core @kind logic */
import { z } from 'zod';
import { presetRefSchema } from './preset-ref-schema';

const presetDeleteSchema = z.strictObject({ preset: presetRefSchema });

export { presetDeleteSchema };
