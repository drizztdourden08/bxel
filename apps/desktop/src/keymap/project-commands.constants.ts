/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { closeProject } from '../project/close-project';
import { openProject } from '../project/open-project';
import { PROJECT_COMMAND, PROJECT_GROUP, PROJECT_TEXT, PROJECT_WIDGET_ID } from '../project/project.constants';
import { useProjectStore } from '../stores/useProjectStore';

const hasProject = (): boolean => useProjectStore.getState().project !== null;

const PROJECT_COMMANDS: readonly CommandDef[] = [
  {
    id: PROJECT_COMMAND.new,
    label: 'New project',
    icon: 'folder',
    group: PROJECT_GROUP,
    run: () => useProjectStore.getState().showDialog(true),
  },
  {
    id: PROJECT_COMMAND.open,
    label: 'Open project',
    icon: 'folder-open',
    group: PROJECT_GROUP,
    run: () => {
      void openProject();
    },
  },
  {
    id: PROJECT_COMMAND.close,
    label: 'Close project',
    group: PROJECT_GROUP,
    when: hasProject,
    run: () => {
      void closeProject();
    },
  },
  {
    id: PROJECT_COMMAND.settings,
    label: 'Project settings',
    icon: 'settings',
    group: PROJECT_GROUP,
    when: hasProject,
    run: () => useProjectStore.getState().showSettings(true),
  },
  {
    id: PROJECT_COMMAND.panel,
    label: PROJECT_TEXT.showPanel,
    group: PROJECT_GROUP,
    run: () => useWidgetLayoutStore.getState().open(PROJECT_WIDGET_ID),
  },
];

export { PROJECT_COMMANDS };
