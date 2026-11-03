/* @layer renderer-app @kind logic */
import type { AnchoredRect } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelRect } from '../../PixelViewport';

const anchorRect = (anchor: PixelRect | null): AnchoredRect | null => {
  const { viewport } = useViewStore.getState();
  if (!viewport || !anchor) return null;
  const first = viewport.pixelToScreen(anchor.x, anchor.y);
  const last = viewport.pixelToScreen(anchor.x + anchor.width, anchor.y + anchor.height);
  return { left: first.x, top: first.y, width: last.x - first.x, height: last.y - first.y };
};

export { anchorRect };
