/* @layer renderer-app @kind types */
import type { PixelView } from '../../PixelViewport';

type AreaContext = Pick<
  CanvasRenderingContext2D,
  'fillRect' | 'fillStyle' | 'globalAlpha' | 'lineWidth' | 'restore' | 'save' | 'strokeRect' | 'strokeStyle'
>;

type AreaView = Pick<PixelView, 'zoom'>;

export type { AreaContext, AreaView };
