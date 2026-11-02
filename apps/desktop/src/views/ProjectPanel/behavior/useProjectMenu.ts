/* @layer renderer-app @kind hook */
import { useCommands, useContextMenu } from '@drizztdourden08/brock-react';
import { gated } from '../../../keymap/gated';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { menuSelection } from './menu-selection';
import { projectMenuCommands } from './project-menu-commands';
import { projectMenuEntries } from './project-menu-entries';
import { startMenuEntries } from './start-menu-entries';

const useProjectMenu = (model: ProjectPanelModel): void => {
  useCommands(projectMenuCommands(model).map(gated));
  useContextMenu(COMMAND_ZONE.project, {
    label: PROJECT_MENU.label,
    selection: (where) => menuSelection(model, where),
    entries: (context) => projectMenuEntries(context, model),
  });
  useContextMenu(PROJECT_MENU.zone, { label: PROJECT_MENU.label, entries: () => startMenuEntries(model) });
};

export { useProjectMenu };
