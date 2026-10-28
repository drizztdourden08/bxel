/* @layer renderer-app @kind logic */
import type { LabelledShortcut, ToolbarChoice, ToolbarItem } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { readOption } from '../../../editor/tool-options/read-option';
import { setOption } from '../../../editor/tool-options/set-option';
import type { OptionChoice, OptionSpec } from '../../../editor/tool-options/tool-options.type';
import type { KeysOf } from '../../../hooks/useKeysOf';

const choiceOf = (choice: OptionChoice): ToolbarChoice => ({
  value: choice.value,
  label: choice.label,
  description: choice.description,
  shortcut: choice.keys,
  icon: choice.icon ?? createElement('span', { className: 'option-glyph' }, choice.glyph),
});

const shortcutOf = (spec: OptionSpec, keysOf: KeysOf): LabelledShortcut[] | undefined => {
  const rows = (spec.shortcuts ?? []).flatMap((row) => {
    const keys = keysOf(row.command);
    return keys ? [{ label: row.label ?? spec.label, keys }] : [];
  });
  return rows.length > 0 ? rows : undefined;
};

const optionItem = (spec: OptionSpec, keysOf: KeysOf): ToolbarItem => {
  const reason = spec.disabledReason?.();
  const common = { id: spec.id, label: spec.label, description: reason ?? spec.description, shortcut: shortcutOf(spec, keysOf), disabled: reason !== undefined };
  const value = readOption(spec);
  if (spec.kind === 'number') {
    return { ...common, kind: 'number', min: spec.min, max: spec.max, step: spec.step, value: Number(value), onChange: (next) => setOption(spec, next) };
  }
  if (spec.kind === 'choice') {
    const choices = (spec.choices ?? []).map(choiceOf);
    return { ...common, kind: 'group', value: String(value), choices, onChange: (next) => setOption(spec, next) };
  }
  const icon = spec.icon ?? 'square';
  if (spec.kind === 'toggle') {
    return { ...common, kind: 'toggle', icon, caption: spec.caption, pressed: value === true, onChange: (next) => setOption(spec, next) };
  }
  return { ...common, kind: 'button', icon, caption: spec.caption, onSelect: () => spec.write(true) };
};

export { optionItem };
