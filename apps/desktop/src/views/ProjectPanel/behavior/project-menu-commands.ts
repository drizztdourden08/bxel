/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { revealRow } from '../../../asset-list/reveal-row';
import { commandArgs } from '../../../context-menu/command-args';
import type { ProjectArgs, TabArgs } from '../../../context-menu/menu-args.type';
import { PROJECT_GROUP } from '../../../project/project.constants';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { entryPath } from './entry-path';

const rowOf = (model: ProjectPanelModel, context: CommandContext | undefined): AssetRow | undefined => {
  const { rowId } = commandArgs<ProjectArgs>(context);
  const { tabId } = commandArgs<TabArgs>(context);
  const { tabs } = useWorkspaceStore.getState();
  const assetId = tabs.find((tab) => tab.id === tabId)?.key.id;
  return model.assets.rows.find((row) => (rowId === undefined ? row.assetId === assetId : row.id === rowId));
};

const folderPathOf = (model: ProjectPanelModel, name: string): string | null => {
  const entry = model.listing?.entries.find((each) => each.name === name && each.kind === 'folder');
  const path = entry === undefined ? '' : entryPath(model, entry);
  return path === '' ? null : path;
};

const onRow = (model: ProjectPanelModel, run: (row: AssetRow) => void) => (context?: CommandContext): void => {
  const row = rowOf(model, context);
  if (row) run(row);
};

const projectMenuCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  { id: 'asset.open', label: 'Open an asset', group: PROJECT_GROUP, run: onRow(model, model.assets.open) },
  {
    id: 'asset.rename',
    label: 'Rename an asset',
    group: PROJECT_GROUP,
    run: onRow(model, (row) => {
      model.setView('assets');
      model.assets.startRename(row);
    }),
  },
  { id: 'asset.duplicate', label: 'Duplicate an asset', group: PROJECT_GROUP, run: onRow(model, model.assets.duplicate) },
  { id: 'asset.copy_for_sheet', label: 'Copy a sprite for this sheet', group: PROJECT_GROUP, run: onRow(model, model.assets.copyForSheet) },
  { id: 'asset.export', label: 'Export an asset', group: PROJECT_GROUP, run: onRow(model, model.assets.exportRow) },
  { id: 'asset.show_users', label: 'Show the sheets that use a sprite', group: PROJECT_GROUP, run: onRow(model, model.assets.showUsers) },
  {
    id: 'project.open_entry',
    label: 'Open a file or folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { name } = commandArgs<ProjectArgs>(context);
      const entry = model.listing?.entries.find((each) => each.name === name);
      if (entry) model.openEntry(entry);
    },
  },
  {
    id: 'project.new_asset',
    label: 'New asset of a kind',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { kind, name } = commandArgs<ProjectArgs>(context);
      if (kind === undefined) return;
      const where = name === undefined ? null : folderPathOf(model, name);
      if (where === null) model.newAsset(kind);
      else model.newAssetIn(kind, where);
    },
  },
  {
    id: 'project.new_folder',
    label: 'New folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { name } = commandArgs<ProjectArgs>(context);
      const where = name === undefined ? null : folderPathOf(model, name);
      if (where === null) model.startFolder();
      else model.startFolderIn(where);
    },
  },
  { id: 'project.refresh', label: 'Refresh the project', group: PROJECT_GROUP, run: () => model.refresh() },
  { id: 'project.reveal_root', label: 'Show the project folder', group: PROJECT_GROUP, run: () => revealRow({ path: model.project?.rootRealPath ?? '' }) },
];

export { projectMenuCommands };
