/* @layer renderer-app @kind logic */
import type { ToolbarToggle } from '@drizztdourden08/tessera';
import { hintFace } from './hint-face';
import type { ToggleSpec } from './toolbar-items.type';

const toggleItem = (spec: ToggleSpec): ToolbarToggle => {
  const { label, description, shortcut } = hintFace(spec.hint, spec.keys);
  const { id, icon, caption, disabled, options, openOn, pressed, onChange } = spec;
  return { kind: 'toggle', id, icon, caption, disabled, options, openOn, pressed, onChange, label, description, shortcut };
};

export { toggleItem };
