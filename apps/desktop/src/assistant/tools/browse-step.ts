/* @layer renderer-app @kind logic */
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { applyBrowse } from './apply-browse';
import { browseFolder } from './browse-folder';
import { locationPaths } from './location-paths';
import { reply } from './reply';
import type { ViewStep } from './view-steps.type';

const browseStep: ViewStep = (patch, context) => {
  const { browse } = patch;
  if (!browse) return null;
  const store = useBrowserStore.getState();
  const failed = browseFolder(store.goTo, browse.folder, context);
  if (failed) return failed;
  const picked = browse.selection === undefined ? null : locationPaths(context, browse.selection, 'browse.selection');
  if (picked !== null && !picked.ok) return reply(picked);
  applyBrowse(store, browse, picked === null ? null : picked.value);
  return null;
};

export { browseStep };
