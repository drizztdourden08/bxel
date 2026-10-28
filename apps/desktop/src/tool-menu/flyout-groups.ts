/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import type { FlyoutRow, FlyoutSection } from './tool-menu.type';

const itemOf = (row: FlyoutRow): MenuItem => ({
  id: row.id,
  label: row.label,
  icon: row.icon,
  description: row.reason,
  kind: row.kind === 'action' ? undefined : row.kind,
  checked: row.kind === 'action' ? undefined : row.checked,
  disabled: row.disabled,
  onSelect: row.run,
});

const flyoutGroups = (sections: readonly FlyoutSection[]): MenuGroup[] =>
  sections.map((section) => ({ id: section.id, label: section.label, items: section.rows.map(itemOf) }));

export { flyoutGroups };
