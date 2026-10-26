/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { PROJECT_COMMAND, PROJECT_TEXT } from '../../../project/project.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const startMenuEntries = (model: ProjectPanelModel): readonly ContextMenuEntry[] => [
  PROJECT_COMMAND.new,
  PROJECT_COMMAND.open,
  {
    label: PROJECT_TEXT.openRecent,
    items: model.recents.map((recent) => ({ label: recent.name, run: () => model.openRecent(recent.rootRealPath) })),
  },
];

export { startMenuEntries };
