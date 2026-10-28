/* @layer electron-main @kind logic */
import { fieldOf } from '../../src/assistant-bridge/field-of';
import type { AssistantMain } from './assistant.type';

const wantsRaise = (input: unknown): boolean => fieldOf(fieldOf(input, 'focus'), 'raise') === true;

const raiseWindow = (state: AssistantMain, input: unknown): void => {
  if (state.instance.window !== 'visible' || !wantsRaise(input)) return;
  const win = state.ctx?.window();
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
};

export { raiseWindow };
