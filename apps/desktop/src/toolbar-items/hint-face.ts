/* @layer renderer-app @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import { fixedKeys } from '../views/ActionHint';
import type { HintSpec } from '../views/ActionHint';
import type { HintFace } from './toolbar-items.type';

const hintFace = (hint: HintSpec, keys?: readonly ShortcutKey[]): HintFace => ({
  label: hint.name,
  description: hint.description,
  shortcut: keys ?? fixedKeys(hint),
});

export { hintFace };
