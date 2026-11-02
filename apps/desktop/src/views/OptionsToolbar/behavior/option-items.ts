/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { KeysOf } from '../../../hooks/use-keys-of.type';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { brushPickerItem } from './brush-picker-item';
import { optionItem } from './option-item';

const itemOf = (spec: OptionSpec, keysOf: KeysOf): ToolbarItem => (spec.kind === 'choice' && spec.name === 'tip' ? brushPickerItem(spec) : optionItem(spec, keysOf));

const optionItems = (specs: readonly OptionSpec[], keysOf: KeysOf): ToolbarItem[] =>
  specs.flatMap((spec, at): ToolbarItem[] => {
    const split = at > 0 && specs[at - 1]?.group !== spec.group;
    return [...(split ? [{ kind: 'separator' as const, id: `before-${spec.group}` }] : []), itemOf(spec, keysOf)];
  });

export { optionItems };
