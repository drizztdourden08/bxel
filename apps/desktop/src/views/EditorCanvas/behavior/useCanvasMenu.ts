/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { CANVAS_MENU, MENU_TOOLS } from '../EditorCanvas.constants';
import { canvasMenuEntries } from './canvas-menu-entries';

const useCanvasMenu = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useContextMenu(CANVAS_MENU.zone, {
    label: CANVAS_MENU.label,
    shouldOpen: () => MENU_TOOLS.includes(useToolStore.getState().tool),
    anchor: () => {
      const cursor = useReadoutStore.getState().pointer;
      const at = cursor ? viewport.current?.pixelToScreen(cursor.x + 0.5, cursor.y + 0.5) : undefined;
      return at ? { x: at.x, y: at.y, data: cursor } : null;
    },
    entries: (context) => canvasMenuEntries(context, viewport.current),
  });
};

export { useCanvasMenu };
