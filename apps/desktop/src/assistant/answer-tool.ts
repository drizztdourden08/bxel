/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolCall, ToolReply } from '@bxel/mcp';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { useAssistantStore } from '../stores/useAssistantStore';
import { activityOf } from './activity-of';
import { ASSISTANT_TEXT } from './assistant.constants';
import { TOOL_HANDLERS } from './tool-handlers.constants';
import { reply } from './tools/reply';
import { TOOL_TEXT } from './tools/tools.constants';

const runTool = async (call: ToolCall): Promise<ToolReply> => {
  const port = useAssistantStore.getState().port;
  const kit = fileKit();
  if (!port || !kit) return reply(mcpFailure(MCP_ERROR_CODE.APP_BUSY, 'Bxel is still starting. Try again in a moment.'));
  const settings = port.read();
  if (!settings.assistantAccess) return reply(mcpFailure(MCP_ERROR_CODE.MCP_DISABLED, ASSISTANT_TEXT.disabled));
  const handler = TOOL_HANDLERS[call.tool];
  if (!handler) return reply(mcpFailure(MCP_ERROR_CODE.BRIDGE_ERROR, TOOL_TEXT.notHere));
  try {
    return await handler(call.input, { call, host: kit.host, settings, documents: kit.documents, paths: kit.paths });
  } catch (error) {
    return reply(mcpFailure(MCP_ERROR_CODE.BRIDGE_ERROR, ASSISTANT_TEXT.failed(reasonOf(error)), { retry: 'later' }));
  }
};

const answerTool = async (call: ToolCall): Promise<ToolReply> => {
  const started = Date.now();
  const result = await runTool(call);
  useAssistantStore.getState().record(activityOf(call, result, started));
  return result;
};

export { answerTool };
