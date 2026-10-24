/* @layer core @kind types */
import type { Failure } from '../errors/error.type';

type ToolOk = { readonly ok: true } & Readonly<Record<string, unknown>>;

type ToolOutcome = ToolOk | Failure;

type ToolResult = {
  readonly content: readonly { readonly type: 'text'; readonly text: string }[];
  readonly structuredContent: Readonly<Record<string, unknown>>;
  readonly isError?: true;
};

export type { ToolOk, ToolOutcome, ToolResult };
