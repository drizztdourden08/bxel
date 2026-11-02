/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';

const spriteIdsOf = (items: readonly BrowserItem[]): SpriteId[] =>
  items.flatMap((item) => (item.role === 'file' && item.row?.kind === 'sprite' && item.row.loaded && item.row.assetId !== null ? [item.row.assetId as SpriteId] : []));

export { spriteIdsOf };
