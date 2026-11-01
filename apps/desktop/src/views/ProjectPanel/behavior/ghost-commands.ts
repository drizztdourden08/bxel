/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { removeLoadedRows } from '../../../asset-list/remove-loaded-rows';
import { locateGhost } from '../../../file-ops/locate-ghost';
import { PROJECT_GROUP } from '../../../project/project.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';

const ghostRow = (model: ProjectPanelModel, context: CommandContext | undefined): AssetRow | undefined => {
  const item = commandTargets(model, context).find((each) => each.role === 'ghost');
  return item?.row ?? undefined;
};

const ghostCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  {
    id: 'asset.locate',
    label: 'Locate a missing file',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const row = ghostRow(model, context);
      if (row) void locateGhost(row).then(model.refresh);
    },
  },
  {
    id: 'asset.remove_link',
    label: 'Remove a missing link',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const row = ghostRow(model, context);
      if (row) removeLoadedRows([row], ASSET_LIST_TEXT.linkRemoved(row.name));
    },
  },
];

export { ghostCommands };
