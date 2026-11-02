/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { AxisArgs, GuideColourArgs } from '../context-menu/menu-args.type';
import { addGuideHere } from '../guides/add-guide-here';
import { addGuidesAround } from '../guides/add-guides-around';
import { clearGuides } from '../guides/clear-guides';
import { editGuide } from '../guides/edit-guide';
import { GUIDE_COLOUR_TEXT } from '../guides/guide.constants';
import { setGuideColour } from '../guides/set-guide-colour';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.view;

const GUIDE_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'guide.add_here', label: 'Add a guide at a position', group, run: (context?: CommandContext) => addGuideHere(commandArgs<AxisArgs>(context)) },
  { id: 'guide.edit', label: 'Edit a guide position', group, run: (context?: CommandContext) => editGuide(commandArgs<AxisArgs>(context)) },
  {
    id: 'guide.colour',
    label: GUIDE_COLOUR_TEXT.label,
    group,
    run: (context?: CommandContext) => {
      const { axis, position, colour } = commandArgs<GuideColourArgs>(context);
      if (axis !== undefined && position !== undefined) setGuideColour(axis, position, colour ?? null);
    },
  },
  { id: 'guide.around_selection', label: 'Add guides around the selection', group, run: addGuidesAround },
  { id: 'guide.clear', label: 'Clear guides', group, run: () => clearGuides() },
].map(ruled);

export { GUIDE_MENU_COMMANDS };
