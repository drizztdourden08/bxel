/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { currentSurface } from '../../../surface/current-surface';
import { flyoutEntries } from '../../../tool-menu/flyout-entries';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutSections } from '../../../tool-menu/flyout-sections';

const toolsPanelEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const surface = currentSurface();
  const slot = slotsOf(surface).find((each) => each.id === context.data);
  return slot ? flyoutEntries(flyoutSections(flyoutModel(slot, surface), true)) : [];
};

export { toolsPanelEntries };
