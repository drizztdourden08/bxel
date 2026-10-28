/* @layer renderer-app @kind logic */
import { mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { reply } from './reply';

const commandFail = (code: string, message: string, path?: string): ToolReply => reply(mcpFailure(code, message, path === undefined ? {} : { path }));

export { commandFail };
