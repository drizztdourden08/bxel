/* @layer renderer-app @kind hook */
import type { ListedEntry } from '@bxel/project';
import type { CommandContext } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { commandArgs } from '../../../context-menu/command-args';
import type { ProjectArgs } from '../../../context-menu/menu-args.type';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { PROJECT_RENAME_KEY, PROJECT_TRASH_KEY } from '../../../keymap/zone-key.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const pickedEntry = (model: ProjectPanelModel): ListedEntry | null =>
  model.view === 'folders' ? (model.listing?.entries.find((entry) => entry.name === model.selected) ?? null) : null;

const useProjectKeys = (model: ProjectPanelModel): void => {
  const entry = pickedEntry(model);
  const target = (context: CommandContext | undefined): { entry: ListedEntry | null; row: AssetRow | undefined } => {
    const { name, rowId } = commandArgs<ProjectArgs>(context);
    return {
      entry: name === undefined ? entry : (model.listing?.entries.find((each) => each.name === name) ?? null),
      row: rowId === undefined ? undefined : model.assets.rows.find((each) => each.id === rowId),
    };
  };
  useZoneKey(PROJECT_RENAME_KEY, (context) => {
    const picked = target(context);
    if (picked.row) model.assets.startRename(picked.row);
    else if (picked.entry) model.startRename(picked.entry);
  });
  useZoneKey(PROJECT_TRASH_KEY, (context) => {
    const picked = target(context);
    if (picked.row) model.assets.trash(picked.row);
    else if (picked.entry) model.trash(picked.entry);
  });
};

export { useProjectKeys };
