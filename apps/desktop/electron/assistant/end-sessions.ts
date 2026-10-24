/* @layer electron-main @kind logic */
import type { AssistantMain, LiveSession } from './assistant.type';
import { leaveHeadless } from './leave-headless';

const endSessions = (state: AssistantMain, ended: readonly LiveSession[]): void => {
  for (const session of ended) state.ctx?.log(`assistant: ${session.displayName} (${session.sessionId}) left`);
  if (ended.some((session) => session.launchedThis)) void leaveHeadless(state);
};

export { endSessions };
