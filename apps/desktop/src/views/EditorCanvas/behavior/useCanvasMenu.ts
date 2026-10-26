/* @layer renderer-app @kind hook */
import { useContextMenu, useSettings } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import type { AppSettings } from '../../../settings.type';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { CANVAS_MENU, MENU_TOOLS } from '../EditorCanvas.constants';
import { canvasMenuEntries } from './canvas-menu-entries';

const useCanvasMenu = (viewport: RefObject<PixelViewportHandle | null>): void => {
  const { settings } = useSettings<AppSettings>();
  const always = settings.canvasRightClick === 'menu';
  useContextMenu(CANVAS_MENU.zone, {
    label: CANVAS_MENU.label,
    ...(always ? { openOn: 'release-without-drag' as const } : {}),
    shouldOpen: () => always || MENU_TOOLS.includes(useToolStore.getState().tool),
    anchor: () => {
      const cursor = useReadoutStore.getState().pointer;
      const at = cursor ? viewport.current?.pixelToScreen(cursor.x + 0.5, cursor.y + 0.5) : undefined;
      return at ? { x: at.x, y: at.y, data: cursor } : null;
    },
    entries: (context) => canvasMenuEntries(context, viewport.current),
  });
};

export { useCanvasMenu };
