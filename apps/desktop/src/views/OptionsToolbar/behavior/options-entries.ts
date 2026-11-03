/* @layer renderer-app @kind logic */
import { openKeymapAt, toast, useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { optionCommandOf } from '../../../keymap/option-command-of';
import { allPresets } from '../../../editor/presets/all-presets';
import { applyPreset } from '../../../editor/presets/apply-preset';
import { openSaveDraft } from '../../../editor/presets/open-save-draft';
import { presetsOfTool } from '../../../editor/presets/presets-of-tool';
import { optionById } from '../../../editor/tool-options/option-by-id';
import { resetAllTools } from '../../../editor/tool-options/reset-all-tools';
import { resetOption } from '../../../editor/tool-options/reset-option';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { announcePreset } from '../../../editor/tool-pick/announce-preset';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { currentSurface } from '../../../editor/tool-catalogue/current-surface';
import { stopIdOf } from '../../../tool-menu/stop-id-of';
import { KEYMAP_ROUTE, OPTIONS_WIDGET_ID, TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
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

const ownEntries = (spec: OptionSpec | undefined): ContextMenuEntry[] => {
  const painting = currentSurface() === 'sprite' || currentSurface() === 'tile';
  if (!spec || spec.kind === 'action' || !painting) return [];
  return [{ label: OPTIONS_TEXT.resetOption, icon: 'rotate-ccw', run: () => resetOption(spec) }];
};

const assignEntries = (spec: OptionSpec): ContextMenuEntry[] => {
  const command = optionCommandOf(spec);
  return command ? [{ label: OPTIONS_TEXT.assignKey, icon: 'keyboard', run: () => openKeymapAt(KEYMAP_ROUTE, command) }] : [];
};

const placingEntries = (spec: OptionSpec | undefined): ContextMenuEntry[] => {
  if (!spec) return [];
  const inBar = spec.tier === 1;
  return [
    { label: inBar ? OPTIONS_TEXT.hideFromBar : OPTIONS_TEXT.showInBar, icon: inBar ? 'eye-off' : 'eye', run: () => useToolPrefsStore.getState().setOptionTier(spec.id, inBar ? 2 : 1) },
    ...assignEntries(spec),
    { label: OPTIONS_TEXT.help, icon: 'info', run: () => toast(`${spec.label}. ${spec.description}`, { variant: 'info' }) },
    'separator',
  ];
};

const optionsEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const spec = optionById(stopIdOf(context.target) ?? '');
  const tool = useToolStore.getState().tool;
  const own = ownEntries(spec);
  const placing = placingEntries(spec);
  return [
    ...own,
    ...placing,
    ...presetEntries(),
    { label: TOOL_MENU_TEXT.savePreset, icon: 'save', run: () => void openSaveDraft() },
    { label: TOOL_MENU_TEXT.resetOptions, icon: 'rotate-ccw', run: () => resetTool(tool) },
    { label: OPTIONS_TEXT.resetAll, icon: 'rotate-ccw', run: resetAllTools },
    { label: TOOL_MENU_TEXT.optionsPanel, icon: 'panel-right', run: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID) },
  ];
};

export { optionsEntries };
