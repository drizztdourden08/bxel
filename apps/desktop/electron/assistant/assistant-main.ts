/* @layer electron-main @kind logic */
import type { AssistantMain } from './assistant.type';
import { createSessionTable } from './create-session-table';
import { publishSessions } from './publish-sessions';
import { pushGrant } from './push-grant';
import { readInstance } from './read-instance';

const assistantMain: AssistantMain = {
  ctx: null,
  access: false,
  folder: '',
  instance: readInstance(),
  bridge: null,
  synced: new Map(),
  sessions: createSessionTable(
    () => publishSessions(assistantMain),
    (session) => pushGrant(assistantMain, session),
  ),
};

export { assistantMain };
