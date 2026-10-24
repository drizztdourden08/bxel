/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { AssistantSetup } from '../../src/assistant/assistant.type';
import { EXIT_CODE } from '../../src/assistant-bridge/launch.constants';
import type { AssistantMain } from './assistant.type';

const refuseStart = (state: AssistantMain, setup: AssistantSetup): void => {
  if (!state.instance.started) return;
  if (!setup.access) app.exit(EXIT_CODE.disabled);
  else if (!setup.start) app.exit(EXIT_CODE.startOff);
};

const applySetup = async (state: AssistantMain, setup: AssistantSetup): Promise<void> => {
  refuseStart(state, setup);
  state.folder = setup.folder;
  const ctx = state.ctx;
  if (!ctx || state.access === setup.access) return;
  state.access = setup.access;
  if (setup.access) {
    await ctx.bridge.open().catch((error: unknown) => ctx.log(`assistant: the bridge did not open: ${String(error)}`, 'error'));
    return;
  }
  state.sessions.revokeAll();
  ctx.bridge.close();
};

export { applySetup };
