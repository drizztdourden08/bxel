/* @layer renderer-app @kind types */
import type { Crumb, HeaderChip } from '../../stage-header/stage-header.type';

interface CrumbItemProps {
  crumb: Crumb;
  last: boolean;
}

interface BreadcrumbTrailProps {
  crumbs: readonly Crumb[];
}

interface ChipItemProps {
  chip: HeaderChip;
}

export type { BreadcrumbTrailProps, ChipItemProps, CrumbItemProps };
