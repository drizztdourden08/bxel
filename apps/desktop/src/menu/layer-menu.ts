/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { LAYER_LABEL } from '../editor/layer-text.constants';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { TILEMAP_COMMAND } from '../keymap/tilemap-command-id.constants';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';

const layerMenu = (state: EditorMenuState): MenuItem => {
  const item = (id: string, label: string) => ruledItem(state.context, id, label);
  const map = state.context.surface === 'map';
  return {
    key: MENU_KEYS.layer,
    label: map ? MENU_TEXT.mapLayer : MENU_TEXT.layer,
    icon: 'pixel-layers',
    children: tidyMenu([
      item(COMMAND_ID.layerAdd, LAYER_LABEL.add),
      item(COMMAND_ID.layerDuplicate, LAYER_LABEL.duplicate),
      item(COMMAND_ID.layerDelete, LAYER_LABEL.remove),
      'separator',
      item(COMMAND_ID.layerMerge, LAYER_LABEL.merge),
      item(COMMAND_ID.layerFlatten, LAYER_LABEL.flatten),
      'separator',
      item(COMMAND_ID.layerAbove, 'Select layer above'),
      item(COMMAND_ID.layerBelow, 'Select layer below'),
      'separator',
      item(TILEMAP_COMMAND.layerUp, 'Move map layer up'),
      item(TILEMAP_COMMAND.layerDown, 'Move map layer down'),
    ]),
  };
};

export { layerMenu };
