/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { revealRow } from '../../../asset-list/reveal-row';
import { commandArgs } from '../../../context-menu/command-args';
import type { ProjectArgs } from '../../../context-menu/menu-args.type';
import { PROJECT_GROUP } from '../../../project/project.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { itemOfArgs } from './item-of-args';

const projectCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  {
    id: 'project.open_entry',
    label: 'Open a file or toggle a folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const item = itemOfArgs(model, commandArgs<ProjectArgs>(context));
      if (item) model.rowActions.open(item);
    },
  },
  {
    id: 'project.new_asset',
    label: 'New asset of a kind',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { kind, key } = commandArgs<ProjectArgs>(context);
      if (kind !== undefined) model.rowActions.newAsset(kind, key);
    },
  },
  {
    id: 'project.new_folder',
    label: 'New folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => model.rowActions.newFolder(commandArgs<ProjectArgs>(context).key),
  },
  { id: 'project.refresh', label: 'Refresh the project', group: PROJECT_GROUP, run: () => model.refresh() },
  { id: 'project.collapse_all', label: 'Collapse every folder', group: PROJECT_GROUP, run: () => model.rowActions.collapseAll() },
  { id: 'project.reveal_root', label: 'Show the project folder', group: PROJECT_GROUP, run: () => revealRow({ path: model.project?.rootRealPath ?? '' }) },
  { id: 'project.open_hub', label: 'Open the Project hub', group: PROJECT_GROUP, run: () => model.openHub() },
  {
    id: 'project.unlink_folder',
    label: 'Unlink a linked folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const item = commandTargets(model, context)[0];
      if (item?.role === 'linked') model.unlink(item.key);
    },
  },
];

export { projectCommands };
