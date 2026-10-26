/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import type { SheetItem } from '../../../sheet/sheet.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { hitSprite } from './hit-sprite';

const sheetClicked = (context: ContextMenuContext, viewport: PixelViewportHandle | null, items: readonly SheetItem[]): SheetItem | null => {
  if (context.trigger === 'keyboard') return null;
  const at = viewport?.screenToPixel(context.point.x, context.point.y);
  return at ? hitSprite(items, at) : null;
};

export { sheetClicked };
