/* @layer helper @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { HELPER_TEXT } from './helper.constants';
import type { HelperState } from './helper.type';
import { NEVER, RESTART_WAIT_MS } from './restart-reconnect.constants';
import { waitForDiscovery } from './wait-for-discovery';

const restartReconnect = async (state: HelperState, input: unknown): Promise<ToolReply> => {
  const since = Date.now();
  const result = await state.session.call('restart_bxel', input);
  if (!result.outcome.ok) return result;
  const wait = await waitForDiscovery(state.file, { pid: undefined, exited: NEVER }, since, RESTART_WAIT_MS);
  const failed = (message: string): ToolReply => ({ outcome: mcpFailure(MCP_ERROR_CODE.RESTART_FAILED, message), images: [] });
  if (wait.kind !== 'ready') return failed(HELPER_TEXT.restartTimeout);
  const paired = await state.session.reconnect();
  if (!paired.ok) return { outcome: paired, images: [] };
  return { outcome: { ...result.outcome, sessionId: paired.value }, images: result.images };
};

export { restartReconnect };
