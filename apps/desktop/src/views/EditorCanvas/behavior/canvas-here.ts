/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuData } from '../../../context-menu/menu-data';
import type { PixelArgs } from '../../../context-menu/menu-args.type';
import { currentTarget } from '../../../editor/current-target';
import { insideSprite } from '../../../editor/inside-sprite';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const canvasHere = (context: ContextMenuContext, viewport: PixelViewportHandle | null): Point | null => {
  const target = currentTarget();
  if (!target) return null;
  const keyboard = menuData<PixelArgs>(context);
  const pointer = context.trigger === 'keyboard' ? useReadoutStore.getState().pointer : (viewport?.screenToPixel(context.point.x, context.point.y) ?? null);
  const at = keyboard.x !== undefined && keyboard.y !== undefined ? { x: keyboard.x, y: keyboard.y } : pointer;
  return at && insideSprite(target, at) ? at : null;
};

export { canvasHere };
