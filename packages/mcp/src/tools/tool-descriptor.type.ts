/* @layer core @kind types */
import type { z } from 'zod';
import type { ToolAnnotations, ToolName } from './tool.type';

type JsonSchemaObject = z.core.JSONSchema.BaseSchema & { type: 'object' };

type ToolDescriptor = {
  readonly name: ToolName;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: JsonSchemaObject;
  readonly outputSchema: JsonSchemaObject;
  readonly annotations: ToolAnnotations;
};

export type { JsonSchemaObject, ToolDescriptor };
