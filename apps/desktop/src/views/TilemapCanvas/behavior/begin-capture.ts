/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { MapPress } from '../TilemapCanvas.type';

const beginCapture = (event: PointerEvent<HTMLElement>, press: MapPress): void => {
  if (press.tool !== 'place' || useTilemapStore.getState().paste) return;
  press.live.current.drag = { kind: 'capture', from: press.cells.near, to: press.cells.near };
  event.currentTarget.setPointerCapture(event.pointerId);
};

export { beginCapture };
