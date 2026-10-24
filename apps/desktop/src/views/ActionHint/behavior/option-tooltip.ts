/* @layer renderer-app @kind logic */
import type { OptionTooltip, ShortcutKey } from '@drizztdourden08/tessera';
import type { HintSpec } from '../ActionHint.type';
import { fixedKeys } from './fixed-keys';

const optionTooltip = (spec: HintSpec, keys?: readonly ShortcutKey[]): OptionTooltip => ({
  description: spec.description,
  shortcut: keys ?? fixedKeys(spec),
});

export { optionTooltip };
