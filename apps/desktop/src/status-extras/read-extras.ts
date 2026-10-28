/* @layer renderer-app @kind logic */
import { EMPTY_EXTRAS } from './status-extras.constants';
import { mapExtras } from './map-extras';
import { pixelExtras } from './pixel-extras';
import type { PixelRead } from './read-extras.type';
import type { StatusExtras } from './status-extras.type';

const readExtras = (read: PixelRead): StatusExtras => {
  if (read.surface === 'map') return mapExtras(read);
  return read.surface === 'sprite' || read.surface === 'tile' ? pixelExtras(read) : EMPTY_EXTRAS;
};

export { readExtras };
