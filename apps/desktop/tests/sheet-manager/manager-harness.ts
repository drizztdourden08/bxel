/* @layer renderer-app @kind test */
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import type { SpriteFacts } from '../../src/sheet-manager/manager.type';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { useManagerStore } from '../../src/stores/useManagerStore';
import { artwork, openFile } from '../sheet/sheet-harness';

const openManagedSheet = (): void => {
  openFile(['a', 'b', 'c'], 8);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
  useManagerStore.getState().reset();
};

const spriteFacts = (): SpriteFacts[] => {
  const art = artwork();
  return allFacts(art, managerSheet(art, null, null));
};

export { openManagedSheet, spriteFacts };
