/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { BridgeCall } from '@drizztdourden08/brock-electron/bridge';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain, LiveSession } from './assistant.type';

const checkSession = (state: AssistantMain, call: BridgeCall, token: string): McpResult<LiveSession> => {
  if (state.sessions.isRevoked(token)) return mcpFailure(MCP_ERROR_CODE.SESSION_REVOKED, MAIN_TEXT.revoked);
  const session = state.sessions.byToken(token);
  if (session?.connectionId !== call.connectionId) return mcpFailure(MCP_ERROR_CODE.SESSION_UNKNOWN, MAIN_TEXT.unknown);
  if (!state.access) return mcpFailure(MCP_ERROR_CODE.MCP_DISABLED, MAIN_TEXT.disabled);
  return { ok: true, value: session };
};

export { checkSession };
