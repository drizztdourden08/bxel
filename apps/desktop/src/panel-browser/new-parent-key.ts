/* @layer renderer-app @kind logic */
import { folderKeyOf } from './folder-key-of';
import { keyOfPath } from './key-of-path';
import type { ParentInput } from './browser-state.type';

const newParentKey = ({ targets, tree, roleDir }: ParentInput): string | null =>
  folderKeyOf(targets[0], tree) ?? keyOfPath(tree, roleDir) ?? tree.mainKey;

export { newParentKey };
