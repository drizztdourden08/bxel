/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import type { DiskProject } from '../../project-manager/project-manager.type';
import { projectKey } from '../../project-manager/project-key';
import type { OpenProject } from '../../project/project.type';
import { useBrowserPersistence } from '../../project-browser/useBrowserPersistence';
import { useBrowserModel } from '../../project-browser/useBrowserModel';
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { BrowserContext } from './behavior/browser-context';
import { useBrowserActions } from './behavior/useBrowserActions';
import { useBrowserKeys } from './behavior/useBrowserKeys';
import type { BrowserContextValue } from './ProjectBrowser.type';
import { BrowserCentre } from './sub-components/BrowserCentre';
import { BrowserStatus } from './sub-components/BrowserStatus';
import { BrowserToolbar } from './sub-components/BrowserToolbar';
import { PreviewPane } from './sub-components/PreviewPane';
import { SourcesPane } from './sub-components/SourcesPane';
import './ProjectBrowser.css';

type ProjectBrowserProps = { readonly project: OpenProject | null; readonly disk: DiskProject | null };

/**
 * The Browse page of the Project window: folders on the left, the files in the middle as a grid, a table or columns,
 * and a large preview on the right. A closed project shows the same way, read only.
 */
const ProjectBrowser = ({ project, disk }: ProjectBrowserProps) => {
  const model = useBrowserModel(project, disk);
  const key = project ? projectKey(project.manifest.projectId, project.rootRealPath) : null;
  useBrowserPersistence(key);
  const { actions, renaming, renameError } = useBrowserActions(model);
  const selection = useBrowserStore((state) => state.selection.ids);
  const preview = useBrowserStore((state) => state.preview);
  const thumb = useBrowserStore((state) => state.size);
  const onKeyDown = useBrowserKeys(model, actions);
  const value = useMemo<BrowserContextValue>(
    () => ({ model, actions, selection: model.selected.map((entry) => entry.id).length === selection.length ? selection : model.selected.map((entry) => entry.id), renaming, renameError, thumb }),
    [model, actions, selection, renaming, renameError, thumb],
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
