/* @layer core @kind types */
import type { z } from 'zod';
import type { TOOL_MODE, TOOL_NAME } from './tool-name.constants';

type ToolName = (typeof TOOL_NAME)[keyof typeof TOOL_NAME];

type ToolMode = 'read' | 'edit';

type ToolHints = {
  readonly readOnly: boolean;
  readonly destructive: boolean;
  readonly idempotent: boolean;
};

type ToolAnnotations = {
  readonly title: string;
  readonly readOnlyHint: boolean;
  readonly destructiveHint: boolean;
  readonly idempotentHint: boolean;
  readonly openWorldHint: false;
};

type ToolDefinition = {
  readonly title: string;
  readonly description: string;
  readonly input: z.ZodType;
  readonly output: z.ZodType;
};

type ToolSpec = ToolDefinition & {
  readonly name: ToolName;
  readonly mode: (typeof TOOL_MODE)[ToolName];
  readonly annotations: ToolAnnotations;
};

export type { ToolAnnotations, ToolDefinition, ToolHints, ToolMode, ToolName, ToolSpec };
