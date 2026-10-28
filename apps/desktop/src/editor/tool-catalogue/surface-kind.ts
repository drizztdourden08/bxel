/* @layer renderer-app @kind logic */
import type { SurfaceKind } from '../../stores/tool-store.type';
import type { Surface } from '../../surface/surface.type';

const surfaceKind = (surface: Surface): SurfaceKind => {
  if (surface === 'map') return 'map';
  return surface === 'sheet' ? 'sheet' : 'paint';
};

export { surfaceKind };
