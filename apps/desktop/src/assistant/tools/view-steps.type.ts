/* @layer renderer-app @kind types */
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { SetViewInput } from './app-tool-input.type';

type ViewStep = (patch: SetViewInput, context: ToolContext) => ToolReply | null;

export type { ViewStep };
