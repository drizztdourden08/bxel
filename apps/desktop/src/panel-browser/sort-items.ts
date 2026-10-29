/* @layer renderer-app @kind logic */
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import { compareNames } from './compare-names';
import { listKindOf } from './list-kind-of';
import type { BrowserItem, ItemCompare } from './project-browser.type';
import type { ProjectViewSettings } from './browser-state.type';

const byName: ItemCompare = (left, right) => compareNames(left.name, right.name);

const order = (item: BrowserItem): number => KIND_ORDER.indexOf(listKindOf(item));

const compares: Readonly<Record<ProjectViewSettings['sort'], ItemCompare>> = {
  name: byName,
  kind: (left, right) => order(left) - order(right) || byName(left, right),
  modified: (left, right) => (right.row?.modified ?? right.modified) - (left.row?.modified ?? left.modified) || byName(left, right),
  created: (left, right) => (right.row?.created ?? -1) - (left.row?.created ?? -1) || byName(left, right),
  folder: (left, right) => compareNames(left.parentKey ?? '', right.parentKey ?? '') || byName(left, right),
};

const sortItems = (items: readonly BrowserItem[], sort: ProjectViewSettings['sort']): readonly BrowserItem[] => [...items].sort(compares[sort]);

export { sortItems };
