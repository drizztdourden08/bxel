/* @layer renderer-app @kind logic */
import type { RampId } from '@bxel/document';
import type { DragEvent } from 'react';
import { RAMP_DRAG_TYPE } from '../PalettePanel.constants';
import type { RampDrag } from '../PalettePanel.type';

const rampDragStart = (index: number, from: RampId | null, event: DragEvent<HTMLElement>): void => {
  const drag: RampDrag = { index, from };
  event.dataTransfer.setData(RAMP_DRAG_TYPE, JSON.stringify(drag));
};

export { rampDragStart };
