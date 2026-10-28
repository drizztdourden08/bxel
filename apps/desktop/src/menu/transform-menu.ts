/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const transformMenu = (state: EditorMenuState): MenuItem => {
  const item = (id: string, label: string) => ruledItem(state.context, id, label);
  return {
    key: MENU_KEYS.transform,
    label: MENU_TEXT.transform,
    children: tidyMenu([
      item(ID.flipHorizontal, 'Flip horizontal'),
      item(ID.flipVertical, 'Flip vertical'),
      item(ID.turnClockwise, 'Rotate 90 clockwise'),
      item(ID.turnCounterClockwise, 'Rotate 90 counterclockwise'),
      'separator',
      item(ID.rotate, 'Rotate...'),
      item(ID.scale, 'Scale...'),
    ]),
  };
};

export { transformMenu };
