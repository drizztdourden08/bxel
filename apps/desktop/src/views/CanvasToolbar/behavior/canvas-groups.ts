/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { ruledItems } from '../../../toolbar-items/ruled-items';
import type { BxelContext } from '../../../ui-context/bxel-context.type';
import type { CanvasGroup } from '../CanvasToolbar.type';

const canvasGroups = (context: BxelContext, groups: readonly CanvasGroup[]): ToolbarItem[] =>
  groups
    .map((group) => ({ id: group.id, items: ruledItems(group.items, context) }))
    .filter((group) => group.items.length > 0)
    .flatMap((group, index): ToolbarItem[] => [...(index > 0 ? [{ kind: 'separator' as const, id: `before-${group.id}` }] : []), ...group.items]);

export { canvasGroups };
