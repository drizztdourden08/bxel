/* @layer renderer-app @kind logic */
import { useManagerStore } from '../stores/useManagerStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { currentArtwork } from './current-artwork';
import { currentScene } from './current-scene';
import { sheetModel } from './sheet-model';
import type { CurrentModel } from './sheet.type';

const currentModel = (): CurrentModel | null => {
  const artwork = currentArtwork();
  if (!artwork) return null;
  const activeId = currentScene()?.active?.id ?? useSpriteStore.getState().activeId;
  return { artwork, model: sheetModel({ artwork, activeId, sheetId: useManagerStore.getState().sheetId }) };
};

export { currentModel };
