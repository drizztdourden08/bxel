/* @layer renderer-app @kind hook */
import type { DragEvent } from 'react';
import { dropIndex } from '../../../add-frames/drop-index';
import { dropSprite } from '../../../add-frames/drop-sprite';
import { SPRITE_DRAG_TYPE } from '../../../sheet/sprite-drag.constants';
import type { AnimationFocus } from '../../../timeline/timeline.type';
import type { StripDrop } from './useStripDrop.type';

const carriesSprite = (event: DragEvent<HTMLElement>): boolean => event.dataTransfer.types.includes(SPRITE_DRAG_TYPE);

const useStripDrop = (focus: AnimationFocus): StripDrop => ({
  onDragOver: (event) => {
    if (!carriesSprite(event) || focus.readOnly) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = event.altKey ? 'copy' : 'link';
  },
  onDrop: (event) => {
    if (!carriesSprite(event)) return;
    event.preventDefault();
    dropSprite(event.dataTransfer.getData(SPRITE_DRAG_TYPE), dropIndex(event.target, event.clientX, focus), event.altKey);
  },
});

export { useStripDrop };
