/* @layer renderer-app @kind logic */
import { slotsOf } from '../editor/tool-catalogue/slots-of';
import { currentSurface } from '../editor/tool-catalogue/current-surface';
import { flyoutModel } from './flyout-model';
import { flyoutSections } from './flyout-sections';
import { BROCK_ENTRY_ROWS } from './menu-point.constants';

const flyoutRows = (slotId: string | null): number => {
  const surface = currentSurface();
  const slot = slotsOf(surface).find((each) => each.id === slotId);
  if (!slot) return BROCK_ENTRY_ROWS;
  const sections = flyoutSections(flyoutModel(slot, surface), true);
  return sections.reduce((sum, section) => sum + section.rows.length + 1, BROCK_ENTRY_ROWS);
};

export { flyoutRows };
