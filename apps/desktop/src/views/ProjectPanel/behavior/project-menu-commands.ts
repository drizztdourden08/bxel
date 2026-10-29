/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { assetCommands } from './asset-commands';
import { projectCommands } from './project-commands';

const projectMenuCommands = (model: ProjectPanelModel): readonly CommandDef[] => [...assetCommands(model), ...projectCommands(model)];

export { projectMenuCommands };
