/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { ByColourArgs, PickHereArgs, SwatchArgs } from '../context-menu/menu-args.type';
import { copySwatchHex } from '../editor/copy-swatch-hex';
import { pickColourHere } from '../editor/pick-colour-here';
import { revealSwatch } from '../editor/reveal-swatch';
import { selectByColour } from '../editor/select-by-colour';
import { setHeldColour } from '../editor/set-held-colour';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const group = COMMAND_GROUP.colours;

const PALETTE_MENU_COMMANDS: readonly CommandDef[] = [
  {
    id: 'palette.use_as',
    label: 'Use a swatch as one of the four colours',
    group,
    run: (context?: CommandContext) => {
      const { slot, index } = commandArgs<SwatchArgs>(context);
      if (slot !== undefined && index !== undefined) setHeldColour(slot, index);
    },
  },
  { id: 'palette.copy_hex', label: 'Copy the hex value of a swatch', group, run: (context?: CommandContext) => void copySwatchHex(commandArgs<SwatchArgs>(context)) },
  { id: 'palette.reveal_swatch', label: 'Show a colour in the palette', group, run: (context?: CommandContext) => revealSwatch(commandArgs<SwatchArgs>(context)) },
  { id: 'palette.pick_here', label: 'Pick the colour under the pointer', group, run: (context?: CommandContext) => pickColourHere(commandArgs<PickHereArgs>(context)) },
  { id: 'selection.by_colour', label: 'Select the pixels of a colour', group: COMMAND_GROUP.edit, run: (context?: CommandContext) => selectByColour(commandArgs<ByColourArgs>(context)) },
].map(ruled);

export { PALETTE_MENU_COMMANDS };
