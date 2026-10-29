/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { MapPress } from '../TilemapCanvas.type';
import { beginCapture } from './begin-capture';
import { beginStroke } from './begin-stroke';
import { placePaste } from './place-paste';

const beginMapPress = (event: PointerEvent<HTMLElement>, press: MapPress): void => {
  if (press.tool === 'zoom') {
    if (event.button === 2) press.viewport.current?.zoomOut({ x: event.clientX, y: event.clientY });
    return;
  }
  if (event.button === 2) {
    beginCapture(event, press);
    return;
  }
  if (event.button !== 0) return;
  if (useTilemapStore.getState().paste) placePaste(press.cells.here);
  else beginStroke(event, press);
};

export { beginMapPress };
