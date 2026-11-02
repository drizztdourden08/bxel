/* @layer renderer-app @kind test */
import type { Artwork, Sheet, SpriteId } from '@bxel/document';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import type { ListQuery, SpriteFacts } from '../../src/sheet-manager/manager.type';
import { managerLists } from '../../src/sheet-manager/manager-lists';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { selectionIds } from '../../src/sheet/selection-ids';
import { spriteScene } from '../../src/sheet/sprite-scene';
import { useManagerStore } from '../../src/stores/useManagerStore';
import type { ManagerModel } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';
import { BASE_QUERY, PLAIN_ATLAS } from './manager-harness.constants';

const idsOf = (...names: string[]): SpriteId[] => names.map(idOf);

const openOnSheet = (names: readonly string[], size = 8): void => {
  openFile(names, size);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
};

const openManagedSheet = (): void => {
  openOnSheet(['a', 'b', 'c']);
  useManagerStore.getState().reset();
};

const spriteFacts = (): SpriteFacts[] => {
  const art = artwork();
  return allFacts(art, managerSheet(art, null, null));
};

const modelFor = (art: Artwork, sheet: Sheet | null, picked: readonly SpriteId[] = [], list: Partial<ListQuery> = {}): ManagerModel => {
  const scene = spriteScene(art, { activeId: picked[0] ?? null, selected: picked });
  const lists = managerLists(art, sheet, { ...BASE_QUERY, ...list }, new Set());
  return { artwork: art, scene, sheet, ...lists, picked: [], sizes: [], tags: [], ids: selectionIds(scene) };
};

export { BASE_QUERY, idsOf, modelFor, openManagedSheet, openOnSheet, PLAIN_ATLAS, spriteFacts };
