/* @layer renderer-app @kind logic */
import { useDrawingStore } from '../stores/useDrawingStore';
import { clampOrigin } from './clamp-origin';

const moveGradientOrigin = (raw: { x: number; y: number }): void => {
  useDrawingStore.getState().patch({ gradientOriginX: clampOrigin(raw.x), gradientOriginY: clampOrigin(raw.y) });
};

export { moveGradientOrigin };
