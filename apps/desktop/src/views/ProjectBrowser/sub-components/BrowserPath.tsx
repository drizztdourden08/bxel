/* @layer renderer-app @kind component */
import { Breadcrumbs } from '@drizztdourden08/tessera';
import { BROWSER_TEXT, OVERFLOW_AFTER } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { browserSegments } from '../behavior/browser-segments';
import { crumbPath } from '../behavior/crumb-path';
import { matchFolder } from '../behavior/match-folder';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useCrumbDrops } from '../behavior/useCrumbDrops';

const BrowserPath = () => {
  const { model } = useBrowserContext();
  const drops = useCrumbDrops();
  return (
    <Breadcrumbs
      segments={browserSegments(model)}
      onNavigate={(id) => useBrowserStore.getState().goTo(crumbPath(id))}
      maxVisible={OVERFLOW_AFTER}
      onSegmentRef={drops.onSegmentRef}
      dropOverId={drops.overId}
      springOpen="navigate"
      path={model.folder ?? ''}
      onPathSubmit={(typed) => useBrowserStore.getState().goTo(matchFolder(typed, model.folderPaths).path)}
      validate={(typed) => (matchFolder(typed, model.folderPaths).found ? null : BROWSER_TEXT.noSuchFolder)}
      label={BROWSER_TEXT.breadcrumbs}
      className="browser-path"
    />
  );
};

export { BrowserPath };
