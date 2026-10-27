/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { guardDocuments } from '../prompts/guard-documents';
import { PromptRefused } from '../prompts/prompt-refused';
import type { ToolHandler } from './assistant.type';
import { reply } from './tools/reply';
import { TOOL_TEXT } from './tools/tools.constants';

const guardHandler =
  (handler: ToolHandler): ToolHandler =>
  async (input, context) => {
    try {
      return await handler(input, { ...context, documents: guardDocuments(context.documents) });
    } catch (error) {
      if (error instanceof PromptRefused) return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_OWNER, TOOL_TEXT.needsOwner(error.prompt)));
      throw error;
    }
  };

export { guardHandler };
