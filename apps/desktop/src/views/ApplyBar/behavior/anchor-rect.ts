/* @layer renderer-app @kind logic */
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelRect } from '../../PixelViewport';
import type { BarRect } from '../ApplyBar.type';

const anchorRect = (anchor: PixelRect | null): BarRect | null => {
  const { viewport } = useViewStore.getState();
  if (!viewport || !anchor) return null;
  const first = viewport.pixelToScreen(anchor.x, anchor.y);
  const last = viewport.pixelToScreen(anchor.x + anchor.width, anchor.y + anchor.height);
  return { left: first.x, top: first.y, right: last.x, bottom: last.y };
};

export { anchorRect };
