/* @layer renderer-app @kind constants */
import type { SpriteSettings } from './sprite-store.type';

const SPRITE_DEFAULTS: SpriteSettings = {
  mode: 'sprite',
  activeId: null,
  selected: [],
  anchor: null,
  broadcast: false,
  isolated: false,
  spritesScope: 'selected',
  layerScope: 'all',
  frameScope: 'all',
  gap: null,
  sliceDraw: false,
  renamingId: null,
};

export { SPRITE_DEFAULTS };
