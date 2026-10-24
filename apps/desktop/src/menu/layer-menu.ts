/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const layerMenu = (state: EditorMenuState): MenuItem => {
  const off = { disabled: !state.hasDocument };
  return {
    key: MENU_KEYS.layer,
    label: MENU_TEXT.layer,
    icon: 'layers',
    children: [
      menuItem(COMMAND_ID.layerAdd, LAYER_LABEL.add, off),
      menuItem(COMMAND_ID.layerDuplicate, LAYER_LABEL.duplicate, off),
      menuItem(COMMAND_ID.layerDelete, LAYER_LABEL.remove, off),
      'separator',
      menuItem(COMMAND_ID.layerMerge, LAYER_LABEL.merge, off),
      menuItem(COMMAND_ID.layerFlatten, LAYER_LABEL.flatten, off),
      'separator',
      menuItem(COMMAND_ID.layerAbove, 'Select layer above', off),
      menuItem(COMMAND_ID.layerBelow, 'Select layer below', off),
    ],
  };
};

export { layerMenu };
