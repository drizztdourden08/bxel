/* @layer renderer-app @kind logic */
import { dnd } from '@drizztdourden08/brock-react';
import type { RefCallback } from 'react';
import { entryDragOptions } from '../../../asset-drag/entry-drag-options';
import { assetPathOf } from '../../../sheet-manager/asset-path-of';
import type { DragEntry } from '../../../sheet-manager/drag-payload.type';
import { parseAnimationKey } from '../../../sheet-manager/parse-animation-key';
import type { ListRow } from '../SpritesPanel.type';

const entryOf = (row: ListRow): DragEntry => {
  const strip = parseAnimationKey(row.id);
  return strip
    ? { kind: 'animation', assetId: strip.animationId, tagId: strip.tagId, path: assetPathOf(strip.animationId) }
    : { kind: 'sprite', assetId: row.id, path: assetPathOf(row.id) };
};

const rowDrag =
  (row: ListRow): RefCallback<HTMLElement> =>
  (element) => (element === null ? undefined : dnd.source(element, entryDragOptions({ entries: () => [entryOf(row)], source: 'sheet' })));

export { rowDrag };
