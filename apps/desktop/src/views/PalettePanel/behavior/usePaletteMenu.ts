/* @layer renderer-app @kind hook */
import { useCommands, useContextMenu } from '@drizztdourden08/brock-react';
import { commandArgs } from '../../../context-menu/command-args';
import type { SwatchArgs } from '../../../context-menu/menu-args.type';
import { menuTarget } from '../../../context-menu/menu-target';
import { swatchRef } from '../../../editor/swatch-ref';
import { COMMAND_GROUP } from '../../../keymap/keymap.constants';
import { PALETTE_MENU, PALETTE_MENU_ZONE, SWATCH_SELECTOR } from '../PalettePanel.constants';
import type { EditSwatch } from '../PalettePanel.type';
import { paletteMenuEntries } from './palette-menu-entries';

const usePaletteMenu = (open: EditSwatch): void => {
  useCommands([
    {
      id: 'palette.edit_swatch',
      label: 'Edit the colour of a swatch',
      group: COMMAND_GROUP.colours,
      run: (context) => {
        const index = swatchRef(commandArgs<SwatchArgs>(context));
        const anchor = index === null ? null : document.querySelector<HTMLElement>(`[data-swatch-index="${index}"]`);
        if (index !== null && anchor) open(index, anchor);
      },
    },
  ]);
  useContextMenu(PALETTE_MENU_ZONE, {
    label: PALETTE_MENU.label,
    shouldOpen: (event) => event.target instanceof Element && menuTarget({ target: event.target }, SWATCH_SELECTOR) === null,
    entries: paletteMenuEntries,
  });
};

export { usePaletteMenu };
