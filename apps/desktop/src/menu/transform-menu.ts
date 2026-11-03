/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import type { PixelIconName } from '../icons/pixel-icon.type';
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const transformMenu = (state: EditorMenuState): MenuItem => {
  const item = (id: string, label: string, icon?: PixelIconName) => ruledItem(state.context, id, label, icon ? { icon } : {});
  return {
    key: MENU_KEYS.transform,
    label: MENU_TEXT.transform,
    children: tidyMenu([
      item(ID.flipHorizontal, 'Flip horizontal'),
      item(ID.flipVertical, 'Flip vertical'),
      item(ID.turnClockwise, 'Rotate 90 clockwise'),
      item(ID.turnCounterClockwise, 'Rotate 90 counterclockwise'),
      item(ID.turnHalf, 'Rotate 180'),
      'separator',
      item(ID.transform, 'Transform', 'pixel-transform'),
      item(ID.rotate, 'Rotate...'),
      {
        key: 'transform-align',
        label: 'Align selection',
        icon: 'pixel-align',
        children: tidyMenu([
          item(ID.alignLeft, 'Left'),
          item(ID.alignCentre, 'Centre'),
          item(ID.alignRight, 'Right'),
          item(ID.alignTop, 'Top'),
          item(ID.alignMiddle, 'Middle'),
          item(ID.alignBottom, 'Bottom'),
          'separator',
          item(ID.distributeHorizontal, 'Distribute horizontally', 'pixel-distribute'),
          item(ID.distributeVertical, 'Distribute vertically', 'pixel-distribute'),
        ]),
      },
      item(ID.scale, 'Scale...'),
    ]),
  };
};

export { transformMenu };
