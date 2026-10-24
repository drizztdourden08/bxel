/* @layer electron-main @kind logic */
import { app } from 'electron';
import { EXIT_CODE } from '../../src/assistant-bridge/launch.constants';
import type { AssistantMain } from './assistant.type';

const setAccess = async (state: AssistantMain, access: boolean, start: boolean): Promise<void> => {
  const ctx = state.ctx;
  if (state.instance.started && !access) app.exit(EXIT_CODE.disabled);
  else if (state.instance.started && !start) app.exit(EXIT_CODE.startOff);
  if (!ctx || state.access === access) return;
  state.access = access;
  if (access) {
    await ctx.bridge.open().catch((error: unknown) => ctx.log(`assistant: the bridge did not open: ${String(error)}`, 'error'));
    return;
  }
  state.sessions.revokeAll();
  ctx.bridge.close();
};

export { setAccess };
