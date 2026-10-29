/* @layer renderer-app @kind logic */
import { currentScene } from '../sheet/current-scene';
import { selectionIds } from '../sheet/selection-ids';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useManagerStore } from '../stores/useManagerStore';
import { boundSheetId } from './bound-sheet';
import { managerLists } from './manager-lists';
import type { CurrentManager } from './manager.type';

const currentManager = (): CurrentManager | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  const scene = currentScene();
  if (!view || !scene) return null;
  const { artwork } = view.state;
  const { query, filter, sortKey, sortDown, collapsed, picked } = useManagerStore.getState();
  const bound = boundSheetId();
  const sheet = artwork.sheets.find((each) => each.id === bound) ?? null;
  const lists = managerLists(artwork, sheet, { query, filter, sortKey, sortDown }, new Set(collapsed));
  return {
    artwork,
    scene,
    sheet,
    facts: lists.facts,
    shown: lists.shown,
    animations: lists.animations,
    picked,
    order: lists.order,
    ids: selectionIds(scene),
    sortKey,
  };
};

export { currentManager };
