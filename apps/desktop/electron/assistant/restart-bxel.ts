/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, mcpFailure, programKey } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { restartApp } from '@drizztdourden08/brock-electron/main';
import { fieldOf } from '../../src/assistant-bridge/field-of';
import { MAIN_TEXT, QUIT_DELAY_MS } from './assistant.constants';
import type { AssistantMain, LiveSession } from './assistant.type';
import { askFlush } from './ask-flush';
import { handoffOf } from './handoff-of';
import { toolReply } from './tool-reply';

const restartBxel = async (state: AssistantMain, session: LiveSession, input: unknown): Promise<ToolReply> => {
  const key = programKey(session.client.name);
  if (key === null) return toolReply(mcpFailure(MCP_ERROR_CODE.RESTART_FAILED, MAIN_TEXT.restartUnnamed));
  const recover = fieldOf(input, 'unsaved') === 'recover';
  const report = await askFlush(state, recover ? 'recover' : 'check');
  const ids = report.unsaved.map((entry) => entry.documentId);
  if (!recover && ids.length > 0) {
    const names = report.unsaved.map((entry) => entry.name).join(', ');
    return toolReply(mcpFailure(MCP_ERROR_CODE.UNSAVED_CHANGES, `${MAIN_TEXT.unsavedRestart} Unsaved: ${names}.`));
  }
  const handoff = handoffOf(session, key);
  setTimeout(() => restartApp({ handoff, window: 'same' }), QUIT_DELAY_MS);
  return toolReply({ ok: true, restarted: true, window: state.instance.window, sessionId: session.sessionId, recovered: ids });
};

export { restartBxel };
