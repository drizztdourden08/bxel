/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { SELECT_ENTRIES } from './select-menu.constants';
import { tidyMenu } from './tidy-menu';

const selectMenu = (state: EditorMenuState): MenuItem => ({
  key: MENU_KEYS.select,
  label: MENU_TEXT.select,
  icon: 'pixel-select-rect',
  children: tidyMenu(SELECT_ENTRIES.map((entry) => (entry === 'separator' ? entry : ruledItem(state.context, entry.id, entry.label)))),
});

export { selectMenu };
