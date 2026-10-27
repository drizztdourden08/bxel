/* @layer electron-main @kind logic */
import { GRANT_EVENT } from '../../src/assistant-bridge/bridge-routes.constants';
import type { AssistantMain, LiveSession } from './assistant.type';

const pushGrant = (state: AssistantMain, session: LiveSession): void => {
  state.bridge?.emitTo(session.connectionId, GRANT_EVENT, session.sessionId, session.grant);
};

export { pushGrant };
