/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { allPresets } from '../editor/presets/all-presets';
import { applyPreset } from '../editor/presets/apply-preset';
import { openSaveDraft } from '../editor/presets/open-save-draft';
import { quickPresets } from '../editor/presets/quick-presets';
import { openQuickPalette } from '../editor/quick-palette/open-quick-palette';
import { QUICK_TAP_MS } from '../editor/quick-palette/quick-palette.constants';
import { releaseQuickPalette } from '../editor/quick-palette/release-quick-palette';
import { chordOfKey } from '../editor/tool-catalogue/chord-of-key';
import { keyOfTool } from '../editor/tool-catalogue/key-of-tool';
import { labelOfTool } from '../editor/tool-catalogue/label-of-tool';
import { memberById } from '../editor/tool-catalogue/member-by-id';
import { toolIds } from '../editor/tool-catalogue/tool-ids';
import { resetTool } from '../editor/tool-options/reset-tool';
import { activeMember } from '../editor/tool-pick/active-member';
import { pointerPick } from '../editor/tool-pick/pointer-pick';
import { announcePreset } from '../editor/tool-pick/announce-preset';
import { beginSpring } from '../editor/tool-pick/begin-spring';
import { endSpring } from '../editor/tool-pick/end-spring';
import { isSpringTool } from '../editor/tool-pick/is-spring-tool';
import { SPRING_TAP_MS } from '../editor/tool-pick/spring-tool.constants';
import { pressToolKey } from '../editor/tool-pick/press-tool-key';
import type { ToolId } from '../editor/tool.type';
import { turnStampKey } from '../tilemap/turn-stamp-key';
import { QUICK_SLOTS } from '../editor/presets/builtin-presets.constants';
import { useCustomizeStore } from '../stores/useCustomizeStore';
import { useToolPrefsStore } from '../stores/useToolPrefsStore';
import { useToolPresetStore } from '../stores/useToolPresetStore';
import { useToolStore } from '../stores/useToolStore';
import { REASON } from '../ui-context/reasons.constants';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { needs } from './needs';
import { TOOL_COMMAND } from './option-command-id.constants';
import { ruled } from './ruled';
import { slotArgs } from './slot-args';
import { slotBindings } from './slot-bindings';
import { slotOfArgs } from './slot-of-args';

const CYCLING: readonly ToolId[] = ['select'];

const springHold = (tool: ToolId): Pick<CommandDef, 'hold'> => (isSpringTool(tool) ? { hold: { release: endSpring, tapMs: SPRING_TAP_MS } } : {});

const selectCommand = (tool: ToolId): CommandDef =>
  ruled({

    id: COMMAND_ID.tool(tool),

    label: labelOfTool('sprite', tool),

    group: COMMAND_GROUP.tools,

    chord: chordOfKey(keyOfTool(tool)),

    ...springHold(tool),

    run: () => {

      if (tool === 'zoom' && turnStampKey('turnRight')) return;

      if (isSpringTool(tool)) beginSpring(tool);

      pressToolKey(tool);

    },

  });


const backCommand = (tool: ToolId): CommandDef =>
  ruled({
    id: TOOL_COMMAND.cycleBack(tool),
    label: `${labelOfTool('sprite', tool)}, previous variant`,
    group: COMMAND_GROUP.tools,
    chord: `Shift+${chordOfKey(keyOfTool(tool))}`,
    run: () => pressToolKey(tool, -1),
  });

const applyById = (context?: CommandContext): void => {
  const args = context?.args;
  const id = typeof args === 'object' && args !== null && 'id' in args ? String(args.id) : '';
  const preset = allPresets(useToolPresetStore.getState().user).find((each) => each.id === id);
  if (preset && applyPreset(preset)) announcePreset(preset);
};

const quickCommand: CommandDef = ruled({
  id: TOOL_COMMAND.quickPreset,
  label: 'Apply a preset of the tool',
  group: COMMAND_GROUP.tools,
  args: slotArgs(QUICK_SLOTS),
  bindings: slotBindings(QUICK_SLOTS, (slot) => `Alt+${slot}`),
  ...needs(() => quickPresets(useToolStore.getState().tool).length > 0, REASON.noQuickPreset),
  run: (context) => {
    const slot = slotOfArgs(context);
    const preset = slot === null ? undefined : quickPresets(useToolStore.getState().tool)[slot - 1];
    if (preset && applyPreset(preset)) announcePreset(preset);
  },
});

const memberOfArgs = (context?: CommandContext) => {
  const args = context?.args;
  const id = typeof args === 'object' && args !== null && 'id' in args ? String(args.id) : '';
  return id === '' ? activeMember() : memberById(id)?.member;
};

const selectMemberById = (context?: CommandContext): void => {
  const member = memberOfArgs(context);
  if (member) pointerPick(member);
};

const hideMemberById = (context?: CommandContext): void => {
  const member = memberOfArgs(context);
  if (member) useToolPrefsStore.getState().toggleHidden(member.id);
};

const PRESET_COMMANDS: readonly CommandDef[] = [
  { id: TOOL_COMMAND.applyPreset, label: 'Apply a tool preset', group: COMMAND_GROUP.tools, run: applyById },
  { id: TOOL_COMMAND.savePreset, label: 'Save the tool as a preset', group: COMMAND_GROUP.tools, run: () => void openSaveDraft() },
  { id: TOOL_COMMAND.selectMember, label: 'Pick a tool variant', group: COMMAND_GROUP.tools, run: selectMemberById },
  { id: TOOL_COMMAND.hideMember, label: 'Hide or show a tool variant', group: COMMAND_GROUP.tools, run: hideMemberById },
  { id: TOOL_COMMAND.customize, label: 'Customize tools', group: COMMAND_GROUP.tools, run: () => useCustomizeStore.getState().show(true) },
  { id: TOOL_COMMAND.quickPalette, label: 'Quick palette at the pointer', group: COMMAND_GROUP.tools, chord: '`', hold: { release: releaseQuickPalette, tapMs: QUICK_TAP_MS }, run: openQuickPalette },
  { id: TOOL_COMMAND.resetOptions, label: 'Reset the options of the tool', group: COMMAND_GROUP.tools, run: () => resetTool(useToolStore.getState().tool) },
  {
    id: TOOL_COMMAND.previous,
    label: 'Previous tool',
    group: COMMAND_GROUP.tools,
    chord: 'Shift+`',
    ...needs(() => useToolStore.getState().previousTool !== null, REASON.noPreviousTool),
    run: () => {
      const { previousTool, setTool } = useToolStore.getState();
      if (previousTool) setTool(previousTool);
    },
  },
].map(ruled);

const TOOL_COMMANDS: readonly CommandDef[] = [
  ...toolIds().map(selectCommand),
  ...CYCLING.map(backCommand),
  ...PRESET_COMMANDS,
  quickCommand,
];

export { TOOL_COMMANDS };
