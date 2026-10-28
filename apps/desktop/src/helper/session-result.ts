/* @layer helper @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';

const sessionResult = (token: McpResult<string>, sessionId: string | null): McpResult<string> => {
  if (!token.ok) return token;
  return sessionId === null ? mcpFailure(MCP_ERROR_CODE.RESTART_FAILED, 'The new Bxel did not open a session.') : { ok: true, value: sessionId };
};

export { sessionResult };
