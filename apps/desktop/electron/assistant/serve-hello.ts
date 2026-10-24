/* @layer electron-main @kind logic */
import { checkHello, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { HelloReply, HelloRequest } from '@bxel/mcp';
import type { BridgeCall } from '@drizztdourden08/brock-electron/bridge';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain } from './assistant.type';
import { askPair } from './ask-pair';
import { leaveHeadless } from './leave-headless';
import { openSession } from './open-session';

const serveHello =
  (state: AssistantMain) =>
  async (call: BridgeCall, raw: HelloRequest): Promise<HelloReply> => {
    const hello = checkHello(raw);
    if (!hello.ok) return hello;
    if (!state.access) return mcpFailure(MCP_ERROR_CODE.MCP_DISABLED, MAIN_TEXT.disabled);
    const { client, launchToken } = hello.value;
    const launchedThis = state.instance.launchToken !== null && launchToken === state.instance.launchToken;
    const outcome = await askPair(state, { client, headless: state.instance.window === 'headless' });
    if (outcome.ok) return openSession(state, { connectionId: call.connectionId, client, launchedThis }, outcome.mode, outcome.trust);
    if (launchedThis && state.sessions.size() === 0) void leaveHeadless(state);
    return outcome;
  };

export { serveHello };
