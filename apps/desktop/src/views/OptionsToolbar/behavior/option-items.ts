/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { KeysOf } from '../../../hooks/useKeysOf.type';
import type { OptionSpec } from '../../../editor/tool-options/tool-options.type';
import { optionItem } from './option-item';

const optionItems = (specs: readonly OptionSpec[], keysOf: KeysOf): ToolbarItem[] =>
  specs.flatMap((spec, at): ToolbarItem[] => {
    const split = at > 0 && specs[at - 1]?.group !== spec.group;
    return [...(split ? [{ kind: 'separator' as const, id: `before-${spec.group}` }] : []), optionItem(spec, keysOf)];
  });

export { optionItems };
