/* @layer renderer-app @kind logic */
import { folderKeyOf } from '../../../panel-browser/folder-key-of';
import type { BrowserItem, ItemTree } from '../../../panel-browser/project-browser.type';

const pasteFolderOf = (targets: readonly BrowserItem[], tree: ItemTree): BrowserItem | undefined => {
  const key = folderKeyOf(targets[0], tree) ?? tree.mainKey;
  const folder = key === null ? undefined : tree.items.get(key);
  return folder === undefined || folder.readOnly || folder.path === '' ? undefined : folder;
};

export { pasteFolderOf };
