/* @layer electron-main @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fieldOf } from '../../src/assistant-bridge/field-of';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain, LiveSession } from './assistant.type';
import { askFlush } from './ask-flush';
import { quitSoon } from './quit-soon';
import { toolReply } from './tool-reply';

const unsavedOf = (input: unknown): 'refuse' | 'recover' | 'discard' => {
  const value = fieldOf(input, 'unsaved');
  return value === 'recover' || value === 'discard' ? value : 'refuse';
};

const stopBxel = async (state: AssistantMain, session: LiveSession, input: unknown): Promise<ToolReply> => {
  if (!session.launchedThis || state.instance.window !== 'headless') {
    return toolReply(mcpFailure(MCP_ERROR_CODE.STOP_NOT_ALLOWED, MAIN_TEXT.stopNotAllowed));
  }
  const unsaved = unsavedOf(input);
  const report = await askFlush(state, unsaved === 'recover' ? 'recover' : 'check');
  const ids = report.unsaved.map((entry) => entry.documentId);
  if (unsaved === 'refuse' && ids.length > 0) {
    const names = report.unsaved.map((entry) => entry.name).join(', ');
    return toolReply(mcpFailure(MCP_ERROR_CODE.UNSAVED_CHANGES, `${MAIN_TEXT.unsaved} Unsaved: ${names}.`));
  }
  quitSoon();
  return toolReply({
    ok: true,
    stopped: true,
    recovered: unsaved === 'recover' ? ids : [],
    discarded: unsaved === 'discard' ? ids : [],
  });
};

export { stopBxel };
