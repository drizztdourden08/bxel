/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { applySetup } from '../assistant/apply-setup';
import { assistantMain } from '../assistant/assistant-main';
import { askNativePair } from '../assistant/ask-native-pair';
import { clientConfig } from '../assistant/client-config';
import { syncGrants } from '../assistant/sync-grants';

const assistantHandlers: HandlerGroup = {
  id: 'assistant',
  register: (ctx) => {
    const state = assistantMain;
    state.ctx = ctx;
    ctx.handle(APP_CHANNELS.assistantSessions, () => state.sessions.views());
    ctx.handle(APP_CHANNELS.assistantDisconnect, (_event, sessionId) => state.sessions.revoke(sessionId));
    ctx.handle(APP_CHANNELS.assistantSetMode, (_event, sessionId, mode) => state.sessions.setMode(sessionId, mode));
    ctx.handle(APP_CHANNELS.assistantClientConfig, () => clientConfig());
    ctx.handle(APP_CHANNELS.assistantNativePair, (_event, program) => askNativePair(ctx, program));
    ctx.handle(APP_CHANNELS.assistantSetup, (_event, setup) => applySetup(state, setup));
    ctx.handle(APP_CHANNELS.assistantSyncGrants, (_event, entries) => syncGrants(state, entries));
  },
};

export { assistantHandlers };
