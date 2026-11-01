/* @layer renderer-app @kind logic */
import { readOption } from '../../editor/tool-options/read-option';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';

const toolOptionRow = (spec: OptionSpec) => ({
  id: spec.id,
  tool: spec.tool,
  label: spec.label,
  description: spec.description,
  kind: spec.kind,
  tier: spec.tier,
  group: spec.group,
  memory: spec.memory,
  default: spec.default,
  min: spec.min ?? null,
  max: spec.max ?? null,
  choices: spec.choices?.map((choice) => ({ value: choice.value, label: choice.label, description: choice.description })) ?? null,
  command: spec.command ?? null,
  value: spec.kind === 'action' ? null : readOption(spec),
  applies: spec.appliesWhen?.() !== false,
  disabled: spec.disabledReason?.() ?? null,
});

export { toolOptionRow };
