/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { activeSheetOf } from '../../../asset-list/active-sheet-of';
import { quoted } from '../../../panel-browser/quoted';
import { PROJECT_GROUP } from '../../../project/project.constants';
import { addToSheet } from '../../../sheet-manager/add-to-sheet';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { descendantFolders } from './descendant-folders';
import { moveToTargets } from './move-to-targets';
import { openSideTargets } from './open-side-targets';
import { spriteIdsOf } from './sprite-ids-of';
import { newAnimationFrom } from './new-animation-from';
import { newSheetFrom } from './new-sheet-from';

const assetMoreCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  { id: 'asset.open_side', label: 'Open to the side', group: PROJECT_GROUP, run: (context?: CommandContext) => openSideTargets(model, context) },
  { id: 'asset.move_to', label: 'Move to a folder', group: PROJECT_GROUP, run: (context?: CommandContext) => moveToTargets(model, commandTargets(model, context)) },
  {
    id: 'asset.show_uses',
    label: 'Show what an asset uses',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const item = commandTargets(model, context)[0];
      if (item) model.search.toggle(`usedby:${quoted(item.name)}`);
    },
  },
  {
    id: 'asset.add_to_sheet',
    label: 'Add a sprite to the open sheet',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => void addToSheet(spriteIdsOf(commandTargets(model, context)), activeSheetOf()?.sheet.id ?? null),
  },
  {
    id: 'asset.make_animation',
    label: 'Make an animation from a sprite',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => newAnimationFrom(commandTargets(model, context).slice(0, 1)),
  },
  {
    id: 'project.collapse_below',
    label: 'Collapse the folders below',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const item = commandTargets(model, context)[0];
      if (item) model.view.setOpen(descendantFolders(model.data.tree, item.key), false);
    },
  },
  { id: 'project.new_sheet_from', label: 'New sheet from the selected sprites', group: PROJECT_GROUP, run: (context?: CommandContext) => newSheetFrom(commandTargets(model, context)) },
  { id: 'project.new_animation_from', label: 'New animation from the selected sprites', group: PROJECT_GROUP, run: (context?: CommandContext) => newAnimationFrom(commandTargets(model, context)) },
];

export { assetMoreCommands };
