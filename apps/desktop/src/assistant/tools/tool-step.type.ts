/* @layer renderer-app @kind types */
import type { ToolId } from '../../editor/tool.type';

type ToolPick = { readonly tool: ToolId; readonly run: () => void };

export type { ToolPick };
