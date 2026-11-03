/* @layer renderer-app @kind logic */
import type { BreadcrumbSegment, BreadcrumbSibling } from '@drizztdourden08/tessera';
import type { Crumb } from './stage-header.type';

const labelOf = (crumb: Crumb): string => (crumb.note === undefined ? crumb.label : `${crumb.label} (${crumb.note})`);

const siblingsOf = (crumb: Crumb): readonly BreadcrumbSibling[] | undefined =>
  crumb.menu?.flatMap((group): BreadcrumbSibling[] => group.items.map((item) => ({ ...item, group: group.label })));

const crumbSegments = (crumbs: readonly Crumb[]): BreadcrumbSegment[] =>
  crumbs.map((crumb) => {
    const siblings = siblingsOf(crumb);
    return { id: crumb.id, label: labelOf(crumb), title: crumb.title, icon: crumb.icon, siblings, opensMenu: siblings !== undefined };
  });

export { crumbSegments };
