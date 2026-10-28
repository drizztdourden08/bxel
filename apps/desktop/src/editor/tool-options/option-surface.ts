/* @layer renderer-app @kind logic */
import type { Surface } from '../tool-catalogue/surface.type';
import type { OptionSurface } from './tool-options.type';

const optionSurface = (surface: Surface): OptionSurface | null => {
  if (surface === 'map') return 'map';
  return surface === 'sprite' || surface === 'tile' ? 'paint' : null;
};

export { optionSurface };
