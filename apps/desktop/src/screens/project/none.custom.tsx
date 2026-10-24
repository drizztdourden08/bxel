/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera';
import { useEffect } from 'react';
import { openProjectSettings } from '../../config-entry/open-project-settings';
import { PROJECT_CONFIG_TEXT } from '../../project-config/project-config.constants';
import { showProject } from '../../project-config/show-project';
import { openProject } from '../../project/open-project';
import { useProjectStore } from '../../stores/useProjectStore';
import { ConfigEmpty } from '../../views/ConfigEmpty';

const meta: ScreenMeta = { title: 'Project', showHeader: true, icon: 'folder', order: 0, when: showProject(false) };

const searchEntries: SearchEntrySeed[] = [];

const NoProjectScreen = () => {
  const open = useProjectStore((state) => state.project !== null);
  useEffect(() => {
    if (open) openProjectSettings('general');
  }, [open]);
  if (open) return null;
  return (
    <ConfigEmpty
      title={PROJECT_CONFIG_TEXT.noProjectTitle}
      message={PROJECT_CONFIG_TEXT.noProject}
      actions={
        <>
          <Button variant="primary" onClick={() => useProjectStore.getState().showDialog(true)}>
            {PROJECT_CONFIG_TEXT.newProject}
          </Button>
          <Button variant="secondary" onClick={() => void openProject()}>
            {PROJECT_CONFIG_TEXT.openProject}
          </Button>
        </>
      }
    />
  );
};

export default NoProjectScreen;
export { meta, searchEntries };
