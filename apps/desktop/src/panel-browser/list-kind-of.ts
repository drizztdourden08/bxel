/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import type { BrowserItem } from './project-browser.type';

const listKindOf = (item: BrowserItem): RowKind => (item.kind === 'folder' || item.kind === 'group' || item.kind === 'project' || item.kind === 'legacy' ? 'other' : item.kind);

export { listKindOf };
