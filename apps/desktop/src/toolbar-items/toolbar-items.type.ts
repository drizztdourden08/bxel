/* @layer renderer-app @kind types */
import type { IconName, MenuGroup, ShortcutKey } from '@drizztdourden08/tessera';
import type { HintSpec } from '../views/ActionHint';

interface HintFace {
  label: string;
  description: string;
  shortcut: string | readonly ShortcutKey[] | undefined;
}

interface ItemSpec {
  id: string;
  icon: IconName;
  hint: HintSpec;
  keys?: readonly ShortcutKey[];
  caption?: string;
  disabled?: boolean;
  options?: readonly MenuGroup[];
}

interface ToggleSpec extends ItemSpec {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
}

interface ButtonSpec extends ItemSpec {
  onSelect: () => void;
}

export type { ButtonSpec, HintFace, ToggleSpec };
