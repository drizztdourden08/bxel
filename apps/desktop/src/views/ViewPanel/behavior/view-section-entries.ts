/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuData } from '../../../context-menu/menu-data';
import { unless } from '../../../context-menu/unless';
import { SECTION_RESETS } from '../../../view-section/section-resets.constants';
import { sectionInToolbar } from '../../../view-section/section-in-toolbar';
import { SECTION_COMMAND, SECTION_MENU, SECTION_TOOLBAR_ITEMS } from '../../../view-section/view-section.constants';
import type { ViewSectionArgs } from '../../../view-section/view-section.type';

const viewSectionEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const { section } = menuData<ViewSectionArgs>(context);
  if (section === undefined) return [];
  const args = { section };
  return [
    { command: SECTION_COMMAND.reset, args, ...unless(SECTION_RESETS[section] !== undefined, SECTION_MENU.nothingToReset) },
    { command: SECTION_COMMAND.toolbar, args, kind: 'check', checked: sectionInToolbar(section), ...unless(SECTION_TOOLBAR_ITEMS[section] !== undefined, SECTION_MENU.noToolbar) },
    { command: SECTION_COMMAND.settings, args },
  ];
};

export { viewSectionEntries };
