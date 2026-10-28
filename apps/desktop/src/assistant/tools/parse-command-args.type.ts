/* @layer renderer-app @kind types */
import type { ToolReply } from '@bxel/mcp';
import type { Args } from './run-command.type';

type Parsed = { readonly args: Args } | { readonly failure: ToolReply };

export type { Parsed };
