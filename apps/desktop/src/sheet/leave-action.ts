/* @layer renderer-app @kind logic */
import { useSpriteStore } from '../stores/useSpriteStore';
import { backToSheet } from './back-to-sheet';

const leaveAction = (): void => {
  const sprites = useSpriteStore.getState();
  if (sprites.sliceDraw) sprites.setSliceDraw(false);
  else backToSheet();
};

export { leaveAction };
