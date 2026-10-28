/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { ImageRect } from '../Navigator.type';

const visibleRect = (view: PixelView): ImageRect => {
  const width = view.width / view.zoom;
  const height = view.height / view.zoom;
  return { x: view.pan.x - width / 2, y: view.pan.y - height / 2, width, height };
};

export { visibleRect };
