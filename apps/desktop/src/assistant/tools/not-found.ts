/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { reply } from './reply';

const notFound = (text: string, path: string): Promise<ToolReply> => Promise.resolve(reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, text, { path })));

export { notFound };
