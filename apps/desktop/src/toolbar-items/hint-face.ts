/* @layer renderer-app @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { optionTooltip } from '../views/ActionHint';
import type { HintSpec } from '../views/ActionHint';
import type { HintFace } from './toolbar-items.type';

const hintFace = (hint: HintSpec, keys?: readonly ShortcutKey[]): HintFace => {
  const tip = optionTooltip(hint, keys);
  return { label: hint.name, description: hint.description, shortcut: tip.shortcut };
};

export { hintFace };
