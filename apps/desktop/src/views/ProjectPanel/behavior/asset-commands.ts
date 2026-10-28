/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { copyForSheet } from '../../../asset-list/copy-for-sheet';
import { copyPath } from '../../../asset-list/copy-path';
import { exportRow } from '../../../asset-list/export-row';
import { duplicateItems } from '../../../panel-browser/duplicate-items';
import { quoted } from '../../../panel-browser/quoted';
import { relativePathOf } from '../../../panel-browser/relative-path-of';
import { PROJECT_GROUP } from '../../../project/project.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';

const onFirstRow = (model: ProjectPanelModel, run: (row: AssetRow) => void) => (context?: CommandContext): void => {
  const row = commandTargets(model, context)[0]?.row;
  if (row) run(row);
};

const assetCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  {
    id: 'asset.open',
    label: 'Open an asset',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      for (const item of commandTargets(model, context)) model.rowActions.open(item);
    },
  },
  { id: 'asset.duplicate', label: 'Duplicate an asset', group: PROJECT_GROUP, run: (context?: CommandContext) => duplicateItems(commandTargets(model, context)) },
  { id: 'asset.copy_for_sheet', label: 'Copy a sprite for this sheet', group: PROJECT_GROUP, run: onFirstRow(model, copyForSheet) },
  { id: 'asset.export', label: 'Export an asset', group: PROJECT_GROUP, run: onFirstRow(model, exportRow) },
  {
    id: 'asset.show_users',
    label: 'Show what uses an asset',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const item = commandTargets(model, context)[0];
      if (item) model.search.toggle(`uses:${quoted(item.name)}`);
    },
  },
  {
    id: 'asset.copy_relative_path',
    label: 'Copy the path inside the project',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => void copyPath(relativePathOf(commandTargets(model, context)[0])),
  },
];

export { assetCommands };
