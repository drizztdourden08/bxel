/* @layer renderer-app @kind logic */
import { PIXEL_ICON_CACHE, PIXEL_ICON_SIZE, PIXEL_ICON_SOFT_OPACITY, PIXEL_ICONS } from './pixel-icon.constants';
import type { PixelIconData, PixelIconName } from './pixel-icon.type';
import { tonePath } from './tone-path';

const pixelIconData = (name: PixelIconName): PixelIconData => {
  const cached = PIXEL_ICON_CACHE.get(name);
  if (cached) return cached;
  const bitmap = PIXEL_ICONS[name];
  const solid = tonePath(bitmap, 'solid');
  const soft = tonePath(bitmap, 'soft');
  const body = `<g fill="currentColor" shape-rendering="crispEdges"><path d="${solid}"/><path d="${soft}" opacity="${PIXEL_ICON_SOFT_OPACITY}"/></g>`;
  const data: PixelIconData = { body, width: PIXEL_ICON_SIZE, height: PIXEL_ICON_SIZE };
  PIXEL_ICON_CACHE.set(name, data);
  return data;
};

export { pixelIconData };
