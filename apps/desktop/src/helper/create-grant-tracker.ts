/* @layer helper @kind logic */
import type { Grant } from '@bxel/mcp';
import type { GrantTracker } from './create-grant-tracker.type';

const createGrantTracker = (): GrantTracker => {
  const state = { sessionId: null as string | null, grant: null as Grant | null, listeners: [] as (() => void)[] };
  const set = (grant: Grant): void => {
    state.grant = grant;
    for (const listener of state.listeners) listener();
  };
  return {
    current: () => state.grant,
    sessionId: () => state.sessionId,
    accept: (sessionId, grant) => {
      state.sessionId = sessionId;
      set(grant);
    },
    follow: (sessionId, grant) => {
      if (sessionId === state.sessionId) set(grant);
    },
    onChange: (listener) => state.listeners.push(listener),
  };
};

export { createGrantTracker };
