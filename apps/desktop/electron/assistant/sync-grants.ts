/* @layer electron-main @kind logic */
import { readGrant } from '@bxel/mcp';
import type { ProgramGrant } from '../../src/assistant/assistant.type';
import type { AssistantMain, LiveSession } from './assistant.type';

const followsStore = (session: LiveSession): boolean => session.trust === 'remembered' || session.trust === 'prompted';

const syncGrants = (state: AssistantMain, entries: readonly ProgramGrant[]): void => {
  for (const entry of entries) {
    const grant = readGrant(entry.grant);
    if (grant === null) continue;
    const json = JSON.stringify(grant);
    if (state.synced.get(entry.key) === json) continue;
    state.synced.set(entry.key, json);
    for (const session of state.sessions.list()) {
      if (session.programKey === entry.key && followsStore(session) && JSON.stringify(session.grant) !== json) {
        state.sessions.setGrant(session.sessionId, grant, true);
      }
    }
  }
};

export { syncGrants };
