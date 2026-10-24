/* @layer renderer-app @kind logic */
import { MANAGER_DEFAULTS } from './manager-store.constants';
import type { ManagerSettings, ManagerState } from './manager-store.type';

const kept = new Map<string, ManagerSettings>();

const settingsOf = (state: ManagerState): ManagerSettings => ({
  tab: state.tab,
  view: state.view,
  zoom: state.zoom,
  query: state.query,
  filter: state.filter,
  sortKey: state.sortKey,
  sortDown: state.sortDown,
  sheetId: state.sheetId,
  dialog: null,
  atlas: state.atlas,
  collapsed: state.collapsed,
  selections: state.selections,
});

const managerMemory = {
  remember: (documentId: string | null, state: ManagerState): void => {
    if (documentId !== null) kept.set(documentId, settingsOf(state));
  },
  recall: (documentId: string | null): ManagerSettings => ({
    ...((documentId === null ? undefined : kept.get(documentId)) ?? MANAGER_DEFAULTS),
    dialog: null,
  }),
  forget: (documentId: string): void => {
    kept.delete(documentId);
  },
};

export { managerMemory };
