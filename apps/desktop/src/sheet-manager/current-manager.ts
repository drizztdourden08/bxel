/* @layer renderer-app @kind logic */
import { currentScene } from '../sheet/current-scene';
import { selectionIds } from '../sheet/selection-ids';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useManagerStore } from '../stores/useManagerStore';
import { allFacts } from './all-facts';
import { folderGroups } from './folder-groups';
import { managerSheet } from './manager-sheet';
import type { CurrentManager } from './manager.type';
import { twinIds } from './twin-ids';
import { visibleFacts } from './visible-facts';
import { visibleOrder } from './visible-order';

const currentManager = (): CurrentManager | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  const scene = currentScene();
  if (!view || !scene) return null;
  const { artwork } = view.state;
  const { query, filter, sortKey, sortDown, sheetId, collapsed } = useManagerStore.getState();
  const sheet = managerSheet(artwork, sheetId, scene.active?.id ?? null);
  const facts = allFacts(artwork, sheet);
  const twins = twinIds(facts, filter.identical);
  const shown = visibleFacts(facts, { query, filter, sortKey, sortDown, twins });
  return { artwork, scene, sheet, facts, shown, order: visibleOrder(folderGroups(shown, new Set(collapsed))), ids: selectionIds(scene), sortKey };
};

export { currentManager };
