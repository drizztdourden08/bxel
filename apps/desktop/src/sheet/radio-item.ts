/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/tessera';

const radioItem = <T extends string>(value: T, label: string, current: T, pick: (value: T) => void): MenuItem => ({
  id: value,
  label,
  kind: 'radio',
  checked: current === value,
  onSelect: () => pick(value),
});

export { radioItem };
