/* @layer renderer-app @kind logic */
import { fileName } from '../files/file-name';
import { toSlashes } from '../workspace/to-slashes';
import type { BrowserItem, BrowserRoot } from './project-browser.type';

const rootItem = (root: BrowserRoot, failed: ReadonlySet<string>): BrowserItem => {
  const key = toSlashes(root.path).replace(/\/+$/, '');
  return {
    key,
    parentKey: null,
    role: root.main ? 'folder' : 'linked',
    kind: 'folder',
    name: root.name,
    fileName: fileName(key),
    path: key,
    rootKey: key,
    row: null,
    modified: 0,
    size: 0,
    readOnly: !root.granted,
    failed: failed.has(key),
  };
};

export { rootItem };
