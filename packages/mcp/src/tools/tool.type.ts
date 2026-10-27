/* @layer core @kind types */
import type { z } from 'zod';
import type { BundleId, ToolKind } from '../catalogue/catalogue.type';
import type { TOOL_NAME } from './tool-name.constants';

type ToolName = (typeof TOOL_NAME)[keyof typeof TOOL_NAME];

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
  readonly bundle: BundleId;
  readonly kind: ToolKind;
  readonly annotations: ToolAnnotations;
};

export type { ToolAnnotations, ToolDefinition, ToolHints, ToolName, ToolSpec };
