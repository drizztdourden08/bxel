/* @layer renderer-app @kind logic */
import { KIND_LABEL } from '../asset-list/asset-list.constants';
import { pathOfEntry } from '../project-browser/path-of-entry';
import type { BrowserEntry } from '../project-browser/project-browser.type';
import { PROPERTIES_TEXT } from './many-subject.constants';
import type { ManyItem } from './many-subject.type';

const manyItemOf = (entry: BrowserEntry): ManyItem =>
  entry.kind === 'folder'
    ? { id: entry.id, name: entry.name, path: entry.path, kind: PROPERTIES_TEXT.folder, assetId: null, folder: true }
    : { id: entry.id, name: entry.row.name, path: pathOfEntry(entry), kind: KIND_LABEL[entry.row.kind], assetId: entry.row.assetId, folder: false };

export { manyItemOf };
