/* @layer renderer-app @kind logic */
import { useManagerStore } from '../stores/useManagerStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { pickTab } from '../workspace/pick-tab';
import { busy } from './busy';

const backToSheet = (): void => {
  if (busy()) return;
  useSpriteStore.getState().setMode('sheet', false);
  const { sheetId } = useManagerStore.getState();
  if (sheetId !== null) pickTab({ kind: 'sheet', id: sheetId });
};

export { backToSheet };
