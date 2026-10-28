/* @layer renderer-app @kind logic */
import type { BxelContext } from '../ui-context/bxel-context.type';
import type { CanvasSurface } from './canvas-surface.type';

const surfaceOfContext = (context: BxelContext): CanvasSurface => {
  if (context.surface === 'sheet' || context.surface === 'map') return context.surface;
  if (context.surface !== 'pixel') return 'none';
  return context.fileType === 'tileset' || context.fileType === 'tilemap' ? 'tile' : 'sprite';
};

export { surfaceOfContext };
