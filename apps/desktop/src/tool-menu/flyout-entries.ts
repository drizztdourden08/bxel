/* @layer renderer-app @kind logic */
import type { ContextMenuAction, ContextMenuEntry } from '@drizztdourden08/brock-react';
import type { FlyoutRow, FlyoutSection } from './tool-menu.type';

const actionOf = (row: FlyoutRow): ContextMenuAction => ({
  label: row.label,
  icon: row.icon,
  kind: row.kind === 'action' ? undefined : row.kind,
  checked: row.kind === 'action' ? undefined : row.checked,
  disabled: row.disabled,
  reason: row.reason,
  run: row.run,
});

const flyoutEntries = (sections: readonly FlyoutSection[]): ContextMenuEntry[] =>
  sections.flatMap((section, at): ContextMenuEntry[] => [...(at > 0 ? ['separator'] : []), ...section.rows.map(actionOf)]);

export { flyoutEntries };
