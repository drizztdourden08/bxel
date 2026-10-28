/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { ImageRect } from '../Navigator.type';
import { clipRect } from './clip-rect';
import { visibleRect } from './visible-rect';

const shownRect = (view: PixelView): ImageRect => clipRect(visibleRect(view), { width: view.imageWidth, height: view.imageHeight });

export { shownRect };
