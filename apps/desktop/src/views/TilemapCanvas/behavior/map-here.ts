/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuData } from '../../../context-menu/menu-data';
import type { PixelArgs } from '../../../context-menu/menu-args.type';
import { inBounds } from '../../../tilemap/in-bounds';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { cellOf } from './cell-of';

const mapHere = (context: ContextMenuContext, viewport: PixelViewportHandle | null, target: MapTarget): Point | null => {
  const kept = menuData<PixelArgs>(context);
  const pixel = viewport?.screenToPixel(context.point.x, context.point.y);
  const at = kept.x !== undefined && kept.y !== undefined ? { x: kept.x, y: kept.y } : pixel && cellOf(pixel, target);
  return at && inBounds(target.tilemap, at) ? at : null;
};

export { mapHere };
