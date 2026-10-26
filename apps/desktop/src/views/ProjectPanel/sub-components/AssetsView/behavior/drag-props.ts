/* @layer renderer-app @kind logic */
import type { AssetRow } from '../../../../../asset-list/asset-list.type';
import { SPRITE_DRAG_TYPE } from '../../../../../sheet/sprite-drag.constants';
import type { RowDrag } from './drag-props.type';

const dragProps = (row: AssetRow): RowDrag => {
  const spriteId = row.kind === 'sprite' && row.loaded ? row.assetId : null;
  if (spriteId === null) return {};
  return {
    draggable: true,
    onDragStart: (event) => {
      event.dataTransfer.setData(SPRITE_DRAG_TYPE, spriteId);
      event.dataTransfer.effectAllowed = 'copyLink';
    },
  };
};

export { dragProps };
