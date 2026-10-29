/* @layer renderer-app @kind logic */
import { newestTag } from '../editor/selection/newest-tag';
import type { MapSelection } from '../stores/tilemap-store.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSelectionHistoryStore } from '../stores/useSelectionHistoryStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { sameSelection } from './same-selection';

const commitMapSelection = (after: MapSelection | null): void => {
  const store = useTilemapStore.getState();
  const before = store.selection;
  const { activeId } = useDocumentStore.getState();
  if (activeId !== null && !sameSelection(before, after)) {
    useSelectionHistoryStore.getState().record({ documentId: activeId, tag: newestTag(activeId), before: null, after: null, cells: { before, after } });
  }
  store.setSelection(after);
};

export { commitMapSelection };
