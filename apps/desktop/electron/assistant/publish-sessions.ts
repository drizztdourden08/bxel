/* @layer electron-main @kind logic */
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { MAIN_TEXT } from './assistant.constants';
import type { AssistantMain } from './assistant.type';

const publishSessions = (state: AssistantMain): void => {
  const { ctx } = state;
  if (!ctx) return;
  const views = state.sessions.views();
  ctx.emit(APP_CHANNELS.assistantSessionsChanged, views);
  if (state.instance.window !== 'headless') return;
  const names = views.map((view) => view.displayName).join(', ') || MAIN_TEXT.unnamed;
  ctx.tray.set({ tooltip: MAIN_TEXT.tray(names) });
};

export { publishSessions };
