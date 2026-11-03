/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { SELECT_ENTRIES } from './select-menu.constants';
import type { SelectEntry } from './select-menu.type';
import { tidyMenu } from './tidy-menu';

const itemOf = (state: EditorMenuState, entry: SelectEntry) => {
  if (entry === 'separator') return entry;
  return ruledItem(state.context, entry.id, entry.label, entry.icon ? { icon: entry.icon } : {});
};

const selectMenu = (state: EditorMenuState): MenuItem => ({
  key: MENU_KEYS.select,
  label: MENU_TEXT.select,
  icon: 'pixel-select-rect',
  children: tidyMenu(SELECT_ENTRIES.map((entry) => itemOf(state, entry))),
});

export { selectMenu };
