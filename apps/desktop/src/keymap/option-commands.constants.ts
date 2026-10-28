/* @layer renderer-app @kind constants */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { focusOptionsBar } from '../tool-menu/focus-options-bar';
import { OPTIONS_WIDGET_ID } from '../tool-menu/tool-menu.constants';
import { labelOfTool } from '../editor/tool-catalogue/label-of-tool';
import { isRecord } from '../editor/tool-options/is-record';
import { nextValue } from '../editor/tool-options/next-value';
import { OPTION_SPECS } from '../editor/tool-options/option-specs.constants';
import { optionSurface } from '../editor/tool-options/option-surface';
import { resetAllTools } from '../editor/tool-options/reset-all-tools';
import { resetOption } from '../editor/tool-options/reset-option';
import { resetTool } from '../editor/tool-options/reset-tool';
import { setOption } from '../editor/tool-options/set-option';
import type { OptionSpec } from '../editor/tool-options/tool-options.type';
import { useToolStore } from '../stores/useToolStore';
import { currentSurface } from '../editor/tool-catalogue/current-surface';
import { ruled } from './ruled';
import { COMMAND_GROUP } from './keymap.constants';
import { OPTION_COMMAND } from './option-command-id.constants';
import { optionGroups } from './option-groups';
import { optionTarget } from './option-target';

const generated = (spec: OptionSpec): boolean => spec.surface === 'paint' && spec.kind !== 'action';

const specFor = (specs: readonly OptionSpec[]): OptionSpec | undefined => {
  const own = specs.filter((spec) => spec.surface === optionSurface(currentSurface()));
  return own.find((spec) => spec.tool === useToolStore.getState().tool) ?? (specs.length === 1 ? own[0] : undefined);
};

const valueOf = (spec: OptionSpec, args: unknown): unknown => {
  const given = isRecord(args) ? args.value : args;
  return given === undefined ? nextValue(spec) : given;
};

const runGenerated = (specs: readonly OptionSpec[]) => (context?: CommandContext) => {
  const spec = specFor(specs);
  if (!spec) return;
  const value = valueOf(spec, context?.args);
  if (value !== undefined) setOption(spec, value);
};

const groupCommand = ([id, specs]: [string, OptionSpec[]]): CommandDef => {
  const [first] = specs;
  const name = first?.label ?? id;
  return ruled({
    id,
    label: specs.length > 1 ? name : `${labelOfTool('sprite', first?.tool ?? 'pencil')}: ${name}`,
    group: COMMAND_GROUP.brush,
    chord: first?.chord,
    when: () => specFor(specs) !== undefined,
    run: runGenerated(specs),
  });
};

const GENERATED_COMMANDS: readonly CommandDef[] = optionGroups(OPTION_SPECS.filter(generated)).map(groupCommand);

const FIXED_DEFS: CommandDef[] = [
  {
    id: OPTION_COMMAND.set,
    label: 'Set a tool option',
    group: COMMAND_GROUP.tools,
    run: (context) => {
      const target = optionTarget(context?.args);
      if (target) setOption(target.spec, target.value);
    },
  },
  {
    id: OPTION_COMMAND.reset,
    label: 'Reset a tool option',
    group: COMMAND_GROUP.tools,
    run: (context) => {
      const target = optionTarget(context?.args);
      if (target) resetOption(target.spec);
      else resetTool(useToolStore.getState().tool);
    },
  },
  { id: OPTION_COMMAND.focus, label: 'Focus the tool options', group: COMMAND_GROUP.tools, run: () => void focusOptionsBar() },
  { id: OPTION_COMMAND.open, label: 'Open the Tool options panel', group: COMMAND_GROUP.tools, run: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID) },
  { id: OPTION_COMMAND.resetAll, label: 'Reset all tool options', group: COMMAND_GROUP.tools, run: resetAllTools },
  { id: OPTION_COMMAND.sizeDownBy, label: 'Much smaller brush', group: COMMAND_GROUP.brush, chord: 'Shift+[', run: () => useToolStore.getState().stepBrushSize(-4) },
  { id: OPTION_COMMAND.sizeUpBy, label: 'Much larger brush', group: COMMAND_GROUP.brush, chord: 'Shift+]', run: () => useToolStore.getState().stepBrushSize(4) },
];

const OPTION_COMMANDS: readonly CommandDef[] = [...GENERATED_COMMANDS, ...FIXED_DEFS.map(ruled)];

const OPTION_VALUE_COMMAND_IDS: readonly string[] = GENERATED_COMMANDS.map((def) => def.id);

export { OPTION_COMMANDS, OPTION_VALUE_COMMAND_IDS };
