/* @layer renderer-app @kind test */
import type { Artwork, Sheet, SpriteId } from '@bxel/document';
import { managerLists } from '../../src/sheet-manager/manager-lists';
import { NO_FILTER } from '../../src/sheet-manager/manager.constants';
import type { ListQuery } from '../../src/sheet-manager/manager.type';
import { selectionIds } from '../../src/sheet/selection-ids';
import { spriteScene } from '../../src/sheet/sprite-scene';
import type { ManagerModel } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';

const idsOf = (...names: string[]): SpriteId[] => names.map(idOf);

const BASE_QUERY: ListQuery = { query: '', filter: NO_FILTER, sortKey: 'manual', sortDown: false };

const PLAIN_ATLAS: { trim: boolean; powerOfTwo: boolean; rotate: boolean; pageSide: number; page: number } = { trim: false, powerOfTwo: false, rotate: false, pageSide: 0, page: 0 };

const openOnSheet = (names: readonly string[], size = 8): void => {
  openFile(names, size);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
};

const modelFor = (art: Artwork, sheet: Sheet | null, picked: readonly SpriteId[] = [], list: Partial<ListQuery> = {}): ManagerModel => {
  const scene = spriteScene(art, { activeId: picked[0] ?? null, selected: picked });
  const lists = managerLists(art, sheet, { ...BASE_QUERY, ...list }, new Set());
  return { artwork: art, scene, sheet, ...lists, picked: [], sizes: [], tags: [], ids: selectionIds(scene) };
};

export { BASE_QUERY, idsOf, modelFor, openOnSheet, PLAIN_ATLAS };
