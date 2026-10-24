/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { assistantMain } from '../assistant/assistant-main';
import { clientConfig } from '../assistant/client-config';
import { setAccess } from '../assistant/set-access';

const assistantHandlers: HandlerGroup = {
  id: 'assistant',
  register: (ctx) => {
    const state = assistantMain;
    state.ctx = ctx;
    ctx.handle(APP_CHANNELS.assistantSessions, () => state.sessions.views());
    ctx.handle(APP_CHANNELS.assistantDisconnect, (_event, sessionId) => state.sessions.revoke(sessionId));
    ctx.handle(APP_CHANNELS.assistantSetMode, (_event, sessionId, mode) => state.sessions.setMode(sessionId, mode));
    ctx.handle(APP_CHANNELS.assistantClientConfig, () => clientConfig());
    ctx.handle(APP_CHANNELS.assistantSetAccess, (_event, access, start) => setAccess(state, access, start));
  },
};

export { assistantHandlers };
