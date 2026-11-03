/* @layer renderer-app @kind logic */
import type { NavigatorViewport } from '@drizztdourden08/tessera';
import type { PixelPoint, PixelView } from '../../PixelViewport';
import { visibleRect } from './visible-rect';

const panOfViewport = (view: PixelView, next: NavigatorViewport): PixelPoint => {
  const rect = visibleRect(view);
  return {
    x: rect.width >= view.imageWidth ? view.pan.x : next.x + next.width / 2,
    y: rect.height >= view.imageHeight ? view.pan.y : next.y + next.height / 2,
  };
};

export { panOfViewport };
