/* @layer electron-main @kind logic */
import { BYE_SCHEMA } from '@bxel/mcp';
import type { ByeRequest } from '@bxel/mcp';
import type { BridgeCall } from '@drizztdourden08/brock-electron/bridge';
import type { AssistantMain } from './assistant.type';
import { endSessions } from './end-sessions';

const serveBye =
  (state: AssistantMain) =>
  (call: BridgeCall, raw: ByeRequest): boolean => {
    const parsed = BYE_SCHEMA.safeParse(raw);
    const session = parsed.success ? state.sessions.byToken(parsed.data.token) : undefined;
    if (session?.connectionId !== call.connectionId) return false;
    const ended = state.sessions.end(session.token);
    endSessions(state, ended ? [ended] : []);
    return true;
  };

export { serveBye };
