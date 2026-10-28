/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { allPresets } from '../../../editor/presets/all-presets';
import { applyPreset } from '../../../editor/presets/apply-preset';
import { openSaveDraft } from '../../../editor/presets/open-save-draft';
import { presetsOfTool } from '../../../editor/presets/presets-of-tool';
import { optionById } from '../../../editor/tool-options/option-by-id';
import { resetAllTools } from '../../../editor/tool-options/reset-all-tools';
import { resetOption } from '../../../editor/tool-options/reset-option';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import { announcePreset } from '../../../editor/tool-pick/announce-preset';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { currentSurface } from '../../../editor/tool-catalogue/current-surface';
import { stopIdOf } from '../../../tool-menu/stop-id-of';
import { OPTIONS_WIDGET_ID, TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';

const presetEntries = (): ContextMenuEntry[] => {
  const presets = presetsOfTool(allPresets(useToolPresetStore.getState().user), useToolStore.getState().tool);
  if (presets.length === 0) return [];
  const items = presets.map((preset): ContextMenuEntry => ({
    label: preset.name,
    run: () => {
      if (applyPreset(preset)) announcePreset(preset);
    },
  }));
  return [{ label: TOOL_MENU_TEXT.presets, items }];
};

const optionsEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const spec = optionById(stopIdOf(context.target) ?? '');
  const tool = useToolStore.getState().tool;
  const painting = currentSurface() === 'sprite' || currentSurface() === 'tile';
  const own: ContextMenuEntry[] = spec && spec.kind !== 'action' && painting ? [{ label: OPTIONS_TEXT.resetOption, icon: 'rotate-ccw', run: () => resetOption(spec) }] : [];
  return [
    ...own,
    ...presetEntries(),
    { label: TOOL_MENU_TEXT.savePreset, icon: 'save', run: () => void openSaveDraft() },
    { label: TOOL_MENU_TEXT.resetOptions, icon: 'rotate-ccw', run: () => resetTool(tool) },
    { label: OPTIONS_TEXT.resetAll, icon: 'rotate-ccw', run: resetAllTools },
    { label: TOOL_MENU_TEXT.optionsPanel, icon: 'panel-right', run: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID) },
  ];
};

export { optionsEntries };
