/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';

const openSideTargets = (model: ProjectPanelModel, context?: CommandContext): void => {
  for (const item of commandTargets(model, context)) model.rowActions.openBackground(item);
};

export { openSideTargets };
