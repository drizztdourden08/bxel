/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_FIELD_CHOICES } from '../model/tilemap-limits.constants';
import { fieldValueSchema } from './field-value-schema';

const tileFieldSchema = z.strictObject({
  name: z.string().min(1).max(32),
  kind: z.enum(['bool', 'int', 'number', 'text', 'choice', 'colour']),
  default: fieldValueSchema,
  choices: z.array(z.string().min(1).max(32)).max(MAX_FIELD_CHOICES).optional(),
});

export { tileFieldSchema };
