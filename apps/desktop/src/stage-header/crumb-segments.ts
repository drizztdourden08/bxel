/* @layer renderer-app @kind logic */
import type { BreadcrumbSegment, MenuNode } from '@drizztdourden08/tessera';
import type { Crumb } from './stage-header.type';

const labelOf = (crumb: Crumb): string => (crumb.note === undefined ? crumb.label : `${crumb.label} (${crumb.note})`);

const siblingsOf = (crumb: Crumb): readonly MenuNode[] | undefined => {
  if (!crumb.menu) return undefined;
  return crumb.menu.flatMap((group, at): MenuNode[] => (at === 0 ? [...group.items] : [{ separator: true }, ...group.items]));
};

const crumbSegments = (crumbs: readonly Crumb[]): BreadcrumbSegment[] =>
  crumbs.map((crumb) => {
    const siblings = siblingsOf(crumb);
    return { id: crumb.id, label: labelOf(crumb), icon: crumb.icon, siblings, opensMenu: siblings !== undefined };
  });

export { crumbSegments };
