/* @layer renderer-app @kind logic */
import { ASSETS_DRAG_TYPE } from '../../../sheet-manager/drag-payload.constants';
import { SPRITE_DRAG_TYPE } from '../../../sheet/sprite-drag.constants';
import { assetPathOf } from '../../../sheet-manager/asset-path-of';
import type { ListRow } from '../SpritesPanel.type';
import { parseAnimationKey } from '../../../sheet-manager/parse-animation-key';

const rowDrag = (row: ListRow): Record<string, string> => {
  const strip = parseAnimationKey(row.id);
  const entry = strip
    ? { kind: 'animation', assetId: strip.animationId, tagId: strip.tagId, path: assetPathOf(strip.animationId) }
    : { kind: 'sprite', assetId: row.id, path: assetPathOf(row.id) };
  return { [ASSETS_DRAG_TYPE]: JSON.stringify([entry]), ...(strip ? {} : { [SPRITE_DRAG_TYPE]: row.id }) };
};

export { rowDrag };
