/* @layer renderer-app @kind logic */
import type { IconName, ShortcutKey, ToolbarChoice } from '@drizztdourden08/tessera';
import type { HintSpec } from '../views/ActionHint';
import { hintFace } from './hint-face';

const hintChoice = (value: string, icon: IconName, hint: HintSpec, keys?: readonly ShortcutKey[]): ToolbarChoice => {
  const face = hintFace(hint, keys);
  return { value, icon, label: face.label, description: face.description, shortcut: face.shortcut };
};

export { hintChoice };
