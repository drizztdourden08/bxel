/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import type { MapGesture } from '../TilemapCanvas.type';

const mapKeyDown = (gesture: MapGesture) => (event: KeyboardEvent<HTMLElement>): void => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  gesture.cancel();
};

export { mapKeyDown };
