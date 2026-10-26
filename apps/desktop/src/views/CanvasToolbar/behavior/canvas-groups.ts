/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { hasPart } from '../../../surface/has-part';
import type { Surface } from '../../../surface/surface.type';
import type { CanvasGroup } from '../CanvasToolbar.type';

const shown = (surface: Surface, group: CanvasGroup): boolean => group.items.length > 0 && (group.part === null || hasPart(surface, group.part));

const canvasGroups = (surface: Surface, groups: readonly CanvasGroup[]): ToolbarItem[] =>
  groups
    .filter((group) => shown(surface, group))
    .flatMap((group, index): ToolbarItem[] => [...(index > 0 ? [{ kind: 'separator' as const, id: `before-${group.id}` }] : []), ...group.items]);

export { canvasGroups };
