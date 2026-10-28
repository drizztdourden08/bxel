/* @layer renderer-app @kind logic */
import type { BxelContext } from '../../ui-context/bxel-context.type';
import type { Surface } from './surface.type';

const surfaceOfContext = (context: BxelContext): Surface => {
  if (context.surface === 'map') return 'map';
  if (context.surface === 'sheet') return 'sheet';
  if (context.surface !== 'pixel') return 'none';
  return context.fileType === 'tileset' || context.fileType === 'tilemap' ? 'tile' : 'sprite';
};

export { surfaceOfContext };
