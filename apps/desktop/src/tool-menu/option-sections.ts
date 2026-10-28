/* @layer renderer-app @kind logic */
import { readOption } from '../editor/tool-options/read-option';
import { setOption } from '../editor/tool-options/set-option';
import type { OptionSpec } from '../editor/tool-options/tool-options.type';
import type { FlyoutRow, FlyoutSection } from './tool-menu.type';

const choiceRows = (spec: OptionSpec): FlyoutRow[] =>
  (spec.choices ?? []).map((choice) => ({
    id: `${spec.id}.${choice.value}`,
    label: choice.label,
    kind: 'radio',
    checked: String(readOption(spec)) === choice.value,
    disabled: spec.disabledReason?.() !== undefined,
    reason: spec.disabledReason?.(),
    run: () => setOption(spec, choice.value),
  }));

const toggleRow = (spec: OptionSpec): FlyoutRow[] => [
  {
    id: spec.id,
    label: spec.label,
    kind: 'check',
    checked: readOption(spec) === true,
    disabled: spec.disabledReason?.() !== undefined,
    reason: spec.disabledReason?.(),
    run: () => setOption(spec, readOption(spec) !== true),
  },
];

const optionSections = (options: readonly OptionSpec[]): FlyoutSection[] =>
  options.map((spec) => ({ id: spec.id, label: spec.kind === 'choice' ? spec.label : undefined, rows: spec.kind === 'choice' ? choiceRows(spec) : toggleRow(spec) }));

export { optionSections };
