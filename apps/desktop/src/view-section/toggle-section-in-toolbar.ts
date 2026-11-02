/* @layer renderer-app @kind logic */
import { toolbars } from '@drizztdourden08/brock-react';
import { sectionInToolbar } from './section-in-toolbar';
import { CANVAS_TOOLBAR, SECTION_TOOLBAR_ITEMS } from './view-section.constants';
import type { ViewSectionId } from './view-section.type';

const toggleSectionInToolbar = (section: ViewSectionId): void => {
  const ids = SECTION_TOOLBAR_ITEMS[section] ?? [];
  const current = toolbars.list().find((each) => each.id === CANVAS_TOOLBAR)?.hiddenItems ?? [];
  const kept = current.filter((item) => !ids.includes(item));
  toolbars.items(CANVAS_TOOLBAR, sectionInToolbar(section) ? [...kept, ...ids] : kept);
};

export { toggleSectionInToolbar };
