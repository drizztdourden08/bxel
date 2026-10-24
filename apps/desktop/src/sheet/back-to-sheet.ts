/* @layer renderer-app @kind logic */
import { useSpriteStore } from '../stores/useSpriteStore';
import { busy } from './busy';

const backToSheet = (): void => {
  if (busy()) return;
  useSpriteStore.getState().setMode('sheet', false);
};

export { backToSheet };
