/* @layer renderer-app @kind types */
import type { Crumb, HeaderAction, HeaderChip } from '../../stage-header/stage-header.type';

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

interface HeaderChipsProps {
  chips: readonly HeaderChip[];
}

interface HeaderActionsProps {
  actions: readonly HeaderAction[];
}

export type { BreadcrumbTrailProps, ChipItemProps, CrumbItemProps, HeaderActionsProps, HeaderChipsProps };
