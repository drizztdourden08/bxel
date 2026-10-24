/* @layer electron-main @kind logic */
import type { AssistantMain } from './assistant.type';
import { createSessionTable } from './create-session-table';
import { publishSessions } from './publish-sessions';
import { readInstance } from './read-instance';

const assistantMain: AssistantMain = {
  ctx: null,
  access: false,
  instance: readInstance(),
  sessions: createSessionTable(() => publishSessions(assistantMain)),
};

export { assistantMain };
