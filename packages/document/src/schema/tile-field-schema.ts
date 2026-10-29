/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_FIELD_CHOICES } from '../model/tilemap-limits.constants';

const fieldValueSchema = z.union([z.string().max(200), z.number().finite(), z.boolean()]);

const tileFieldSchema = z.strictObject({
  name: z.string().min(1).max(32),
  kind: z.enum(['bool', 'int', 'number', 'text', 'choice', 'colour']),
  default: fieldValueSchema,
  choices: z.array(z.string().min(1).max(32)).max(MAX_FIELD_CHOICES).optional(),
});

export { fieldValueSchema, tileFieldSchema };
