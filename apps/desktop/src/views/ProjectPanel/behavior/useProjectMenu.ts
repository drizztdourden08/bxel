/* @layer renderer-app @kind hook */
import { useCommands, useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { menuKeyOf } from './menu-key-of';
import { projectMenuCommands } from './project-menu-commands';
import { projectMenuEntries } from './project-menu-entries';
import { startMenuEntries } from './start-menu-entries';

const useProjectMenu = (model: ProjectPanelModel): void => {
  useCommands(projectMenuCommands(model));
  const { selection } = model;
  const select = (context: ContextMenuContext): void => {
    const key = menuKeyOf(context);
    if (key === undefined || !model.browser.itemOf(key)) return;
    if (!selection.keys.has(key)) selection.choose([key]);
    selection.focusOn(key);
  };
  useContextMenu(COMMAND_ZONE.project, { label: PROJECT_MENU.label, beforeOpen: select, entries: (context) => projectMenuEntries(context, model) });
  useContextMenu(PROJECT_MENU.zone, { label: PROJECT_MENU.label, entries: () => startMenuEntries(model) });
};

export { useProjectMenu };
