/* @layer renderer-app @kind logic */
import { toolbars } from '@drizztdourden08/brock-react';
import { CANVAS_TOOLBAR, SECTION_TOOLBAR_ITEMS } from './view-section.constants';
import type { ViewSectionId } from './view-section.type';

const sectionInToolbar = (section: ViewSectionId): boolean => {
  const hidden = toolbars.list().find((each) => each.id === CANVAS_TOOLBAR)?.hiddenItems ?? [];
  return (SECTION_TOOLBAR_ITEMS[section] ?? []).every((item) => !hidden.includes(item));
};

export { sectionInToolbar };
