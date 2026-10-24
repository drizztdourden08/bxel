/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';

const menuItem = (command: string, label: string, extra: Partial<MenuItem> = {}): MenuItem => ({
  key: command,
  label,
  command,
  ...extra,
});

export { menuItem };
