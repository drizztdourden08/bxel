/* @layer renderer-app @kind logic */
import { MAX_SAVED_VIEWS } from './manager-views.constants';
import type { ManagerViews, SavedManagerView } from './manager-views.type';

const putView = (views: ManagerViews, id: string, view: SavedManagerView): ManagerViews => {
  const others = Object.entries(views).filter(([each]) => each !== id);
  const entries: [string, SavedManagerView][] = [...others, [id, view]];
  return Object.fromEntries(entries.slice(-MAX_SAVED_VIEWS));
};

export { putView };
