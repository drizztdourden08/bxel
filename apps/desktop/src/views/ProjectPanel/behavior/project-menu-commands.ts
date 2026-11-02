/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { assetCommands } from './asset-commands';
import { assetKindCommands } from './asset-kind-commands';
import { assetMoreCommands } from './asset-more-commands';
import { ghostCommands } from './ghost-commands';
import { projectCommands } from './project-commands';

const projectMenuCommands = (model: ProjectPanelModel): readonly CommandDef[] => [...assetCommands(model), ...assetMoreCommands(model), ...assetKindCommands(model),...ghostCommands(model), ...projectCommands(model)];

export { projectMenuCommands };
