/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { allPresets } from '../editor/presets/all-presets';
import { applyPreset } from '../editor/presets/apply-preset';
import { openSaveDraft } from '../editor/presets/open-save-draft';
import { quickPresets } from '../editor/presets/quick-presets';
import { keyOfTool } from '../editor/tool-catalogue/key-of-tool';
import { labelOfTool } from '../editor/tool-catalogue/label-of-tool';
import { toolIds } from '../editor/tool-catalogue/tool-ids';
import { resetTool } from '../editor/tool-options/reset-tool';
import { announcePreset } from '../editor/tool-pick/announce-preset';
import { pressToolKey } from '../editor/tool-pick/press-tool-key';
import type { ToolId } from '../editor/tool.type';
import { QUICK_SLOTS } from '../editor/presets/builtin-presets.constants';
import { useToolPresetStore } from '../stores/useToolPresetStore';
import { useToolStore } from '../stores/useToolStore';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { TOOL_COMMAND } from './option-command-id.constants';

const CYCLING: readonly ToolId[] = ['shape', 'select', 'fill'];

const selectCommand = (tool: ToolId): CommandDef =>
  editorCommand({ id: COMMAND_ID.tool(tool), label: labelOfTool('sprite', tool), group: COMMAND_GROUP.tools, chord: keyOfTool(tool).toUpperCase(), run: () => pressToolKey(tool) });

const backCommand = (tool: ToolId): CommandDef =>
  editorCommand({
    id: TOOL_COMMAND.cycleBack(tool),
    label: `${labelOfTool('sprite', tool)}, previous variant`,
    group: COMMAND_GROUP.tools,
    chord: `Shift+${keyOfTool(tool).toUpperCase()}`,
    run: () => pressToolKey(tool, -1),
  });

const applyById = (context?: CommandContext): void => {
  const args = context?.args;
  const id = typeof args === 'object' && args !== null && 'id' in args ? String(args.id) : '';
  const preset = allPresets(useToolPresetStore.getState().user).find((each) => each.id === id);
  if (preset && applyPreset(preset)) announcePreset(preset);
};

const quickCommand = (slot: number): CommandDef =>
  editorCommand({
    id: TOOL_COMMAND.quickPreset(slot),
    label: `Apply preset ${slot} of the tool`,
    group: COMMAND_GROUP.tools,
    chord: `Alt+${slot}`,
    when: () => quickPresets(useToolStore.getState().tool)[slot - 1] !== undefined,
    run: () => {
      const preset = quickPresets(useToolStore.getState().tool)[slot - 1];
      if (preset && applyPreset(preset)) announcePreset(preset);
    },
  });

const PRESET_COMMANDS: readonly CommandDef[] = [
  { id: TOOL_COMMAND.applyPreset, label: 'Apply a tool preset', group: COMMAND_GROUP.tools, run: applyById },
  { id: TOOL_COMMAND.savePreset, label: 'Save the tool as a preset', group: COMMAND_GROUP.tools, run: () => void openSaveDraft() },
  { id: TOOL_COMMAND.resetOptions, label: 'Reset the options of the tool', group: COMMAND_GROUP.tools, run: () => resetTool(useToolStore.getState().tool) },
  {
    id: TOOL_COMMAND.previous,
    label: 'Previous tool',
    group: COMMAND_GROUP.tools,
    chord: 'Shift+`',
    when: () => useToolStore.getState().previousTool !== null,
    run: () => {
      const { previousTool, setTool } = useToolStore.getState();
      if (previousTool) setTool(previousTool);
    },
  },
].map(editorCommand);

const TOOL_COMMANDS: readonly CommandDef[] = [
  ...toolIds().map(selectCommand),
  ...CYCLING.map(backCommand),
  ...PRESET_COMMANDS,
  ...Array.from({ length: QUICK_SLOTS }, (_, at) => quickCommand(at + 1)),
];

export { TOOL_COMMANDS };
