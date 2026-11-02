/* @layer core @kind logic */
import { z } from 'zod';
import { patternRefSchema } from './pattern-ref-schema';

const patternDeleteSchema = z.strictObject({ pattern: patternRefSchema });

export { patternDeleteSchema };
