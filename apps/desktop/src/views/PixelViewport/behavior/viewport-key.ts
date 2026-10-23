/* @layer renderer-app @kind logic */
import { PAN_FAST } from '../PixelViewport.constants';
import type { KeyLike, ViewBox, ViewState } from './viewport.type';

const viewportKey = (key: KeyLike, view: ViewState, box: ViewBox): (() => void) | null => {
  if (key.ctrlKey || key.metaKey || key.altKey) return null;
  const step = (box.step * (key.shiftKey ? PAN_FAST : 1)) / view.latest.current.zoom;
  const zoomIn = () => view.zoomStep(1);
  const zoomOut = () => view.zoomStep(-1);
  const actions: Record<string, () => void> = {
    '+': zoomIn,
    '=': zoomIn,
    '-': zoomOut,
    '_': zoomOut,
    '0': view.fit,
    '1': () => view.zoomTo(1),
    ArrowLeft: () => view.panBy(-step, 0),
    ArrowRight: () => view.panBy(step, 0),
    ArrowUp: () => view.panBy(0, -step),
    ArrowDown: () => view.panBy(0, step),
  };
  return actions[key.key] ?? null;
};

export { viewportKey };
