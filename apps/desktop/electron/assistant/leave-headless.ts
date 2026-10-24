/* @layer electron-main @kind logic */
import type { AssistantMain } from './assistant.type';
import { askFlush } from './ask-flush';
import { quitSoon } from './quit-soon';

const leaveHeadless = async (state: AssistantMain): Promise<void> => {
  if (!state.instance.started || state.instance.window !== 'headless') return;
  state.ctx?.log('assistant: the program that started this headless Bxel left; keeping unsaved work for recovery and quitting');
  await askFlush(state, 'recover');
  quitSoon();
};

export { leaveHeadless };
