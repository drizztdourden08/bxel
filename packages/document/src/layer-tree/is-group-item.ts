/* @layer core @kind logic */
import { GROUP_KIND } from './layer-tree.constants';
import type { TreeItem } from './tree-item.type';

const isGroupItem = (item: Pick<TreeItem, 'kind'> | undefined): boolean => item?.kind === GROUP_KIND;

export { isGroupItem };
