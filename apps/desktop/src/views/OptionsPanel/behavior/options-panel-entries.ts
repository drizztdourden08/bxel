/* @layer renderer-app @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { openSaveDraft } from '../../../editor/presets/open-save-draft';
import { resetAllTools } from '../../../editor/tool-options/reset-all-tools';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import { useToolStore } from '../../../stores/useToolStore';
import { focusOptionsBar } from '../../../tool-menu/focus-options-bar';
import { OPTIONS_WIDGET_ID, TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
import { OPTIONS_PANEL_TEXT } from '../OptionsPanel.constants';

const optionsPanelEntries = (): ContextMenuEntry[] => [
  { label: OPTIONS_PANEL_TEXT.savePreset, icon: 'save', run: () => openSaveDraft() },
  { label: TOOL_MENU_TEXT.resetOptions, icon: 'rotate-ccw', run: () => resetTool(useToolStore.getState().tool) },
  { label: OPTIONS_PANEL_TEXT.resetAll, icon: 'rotate-ccw', run: resetAllTools },
  'separator',
  { label: OPTIONS_PANEL_TEXT.focusBar, icon: 'sliders-horizontal', run: () => focusOptionsBar() },
  'separator',
  { label: OPTIONS_PANEL_TEXT.popOut, icon: 'external-link', run: () => widgets.popOut(OPTIONS_WIDGET_ID) },
  { label: OPTIONS_PANEL_TEXT.dock, icon: 'panel-right', run: () => void widgets.dock(OPTIONS_WIDGET_ID, { side: 'right' }) },
];

export { optionsPanelEntries };
