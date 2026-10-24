/* @layer renderer-app @kind logic */
import type { ToolbarButton } from '@drizztdourden08/tessera';
import { hintFace } from './hint-face';
import type { ButtonSpec } from './toolbar-items.type';

const buttonItem = (spec: ButtonSpec): ToolbarButton => {
  const { label, description, shortcut } = hintFace(spec.hint, spec.keys);
  const { id, icon, caption, disabled, options, openOn, onSelect } = spec;
  return { kind: 'button', id, icon, caption, disabled, options, openOn, onSelect, label, description, shortcut };
};

export { buttonItem };
