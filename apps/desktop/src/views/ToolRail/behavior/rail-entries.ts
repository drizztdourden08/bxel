/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { currentSurface } from '../../../editor/tool-catalogue/current-surface';
import { flyoutEntries } from '../../../tool-menu/flyout-entries';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutSections } from '../../../tool-menu/flyout-sections';
import { TOOL_MENU_TEXT, TOOLS_WIDGET_ID } from '../../../tool-menu/tool-menu.constants';
import { stopIdOf } from '../../../tool-menu/stop-id-of';

const emptyEntries = (): ContextMenuEntry[] => [
  { label: TOOL_MENU_TEXT.panel, icon: 'panel-right', run: () => useWidgetLayoutStore.getState().open(TOOLS_WIDGET_ID) },
  { label: TOOL_MENU_TEXT.resetLayout, icon: 'eye', run: () => useToolPrefsStore.getState().resetLayout() },
];

const railEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const surface = currentSurface();
  const id = typeof context.data === 'string' ? context.data : stopIdOf(context.target);
  const slot = slotsOf(surface).find((each) => each.id === id);
  return slot ? flyoutEntries(flyoutSections(flyoutModel(slot, surface), true)) : emptyEntries();
};

export { railEntries };
