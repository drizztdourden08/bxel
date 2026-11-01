/* @layer renderer-app @kind logic */
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { locationPath } from './location-path';
import { locationPaths } from './location-paths';
import { reply } from './reply';
import type { ViewStep } from './view-steps.type';

const browseStep: ViewStep = (patch, context) => {
  const { browse } = patch;
  if (!browse) return null;
  const store = useBrowserStore.getState();
  if (browse.folder !== undefined) {
    const folder = browse.folder === null ? null : locationPath(context, browse.folder, 'browse.folder');
    if (folder !== null && !folder.ok) return reply(folder);
    store.goTo(folder === null ? null : folder.value);
  }
  const picked = browse.selection === undefined ? null : locationPaths(context, browse.selection, 'browse.selection');
  if (picked !== null && !picked.ok) return reply(picked);
  if (browse.view !== undefined) store.setView(browse.view);
  if (browse.search !== undefined) store.setQuery(browse.search);
  if (picked !== null) store.select({ ids: picked.value, anchor: picked.value[0] ?? null });
  return null;
};

export { browseStep };
