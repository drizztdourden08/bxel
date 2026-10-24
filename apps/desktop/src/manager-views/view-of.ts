/* @layer renderer-app @kind logic */
import type { ManagerSettings } from '../stores/manager-store.type';
import type { SavedManagerView } from './manager-views.type';

const viewOf = (settings: ManagerSettings): SavedManagerView => ({
  tab: settings.tab,
  view: settings.view,
  zoom: settings.zoom,
  query: settings.query,
  filter: settings.filter,
  sortKey: settings.sortKey,
  sortDown: settings.sortDown,
  atlas: settings.atlas,
  collapsed: settings.collapsed,
  selections: settings.selections,
});

export { viewOf };
