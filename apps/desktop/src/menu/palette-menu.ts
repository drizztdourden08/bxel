/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { DIALOG_COMMAND } from '../keymap/dialog-command-id.constants';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const paletteMenu = (state: EditorMenuState): MenuItem => {
  const item = (id: string, label: string) => ruledItem(state.context, id, label);
  return {
    key: MENU_KEYS.palette,
    label: MENU_TEXT.palette,
    icon: 'pixel-palette',
    children: tidyMenu([
      item(COMMAND_ID.swapColours, 'Swap colours'),
      item(COMMAND_ID.swapColourPairs, 'Swap colour pairs'),
      item(COMMAND_ID.colourBack, 'Previous colour'),
      item(COMMAND_ID.colourForward, 'Next colour'),
      'separator',
      item(DIALOG_COMMAND.deleteSwatch, 'Delete swatch...'),
      item(DIALOG_COMMAND.mergeSwatch, 'Merge swatch...'),
      item(DIALOG_COMMAND.changeLimit, 'Change colour limit...'),
    ]),
  };
};

export { paletteMenu };
