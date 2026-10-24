/* @layer core @kind logic */
import { z } from 'zod';
import type { JsonSchemaObject } from './tool-descriptor.type';

const toolJsonSchema = (schema: z.ZodType, io: 'input' | 'output'): JsonSchemaObject => ({
  ...z.toJSONSchema(schema, { io, unrepresentable: 'any' }),
  type: 'object',
});

export { toolJsonSchema };
