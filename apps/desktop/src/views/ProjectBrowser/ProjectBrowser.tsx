/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { projectKey } from '../../project-manager/project-key';
import { useBrowserPersistence } from '../../project-browser/useBrowserPersistence';
import { useBrowserModel } from '../../project-browser/useBrowserModel';
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { BrowserContext } from './behavior/browser-context';
import { useBrowserActions } from './behavior/useBrowserActions';
import { useBrowserKeys } from './behavior/useBrowserKeys';
import type { BrowserContextValue, ProjectBrowserProps } from './ProjectBrowser.type';
import { BrowserCentre } from './sub-components/BrowserCentre';
import { BrowserStatus } from './sub-components/BrowserStatus';
import { BrowserToolbar } from './sub-components/BrowserToolbar';
import { PreviewPane } from './sub-components/PreviewPane';
import { SourcesPane } from './sub-components/SourcesPane';
import './ProjectBrowser.css';

const ProjectBrowser = ({ project, disk }: ProjectBrowserProps) => {
  const model = useBrowserModel(project, disk);
  const key = project ? projectKey(project.manifest.projectId, project.rootRealPath) : null;
  useBrowserPersistence(key);
  const { actions, renaming, renameError } = useBrowserActions(model);
  const preview = useBrowserStore((state) => state.preview);
  const thumb = useBrowserStore((state) => state.size);
  const onKeyDown = useBrowserKeys(model, actions);
  const shownIds = useMemo(() => model.selected.map((entry) => entry.id), [model.selected]);
  const value = useMemo<BrowserContextValue>(
    () => ({ model, actions, selection: shownIds, renaming, renameError, thumb }),
    [model, actions, shownIds, renaming, renameError, thumb],
  );
  return (
    <BrowserContext.Provider value={value}>
      <Box className="project-browser" onKeyDown={onKeyDown}>
        <BrowserToolbar />
        <Box className="project-browser__body" data-preview={preview}>
          <SourcesPane />
          <BrowserCentre />
          {preview && <PreviewPane />}
        </Box>
        <BrowserStatus />
      </Box>
    </BrowserContext.Provider>
  );
};

export { ProjectBrowser };
