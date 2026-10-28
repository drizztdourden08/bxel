/* @layer renderer-app @kind logic */
import { useReadoutStore } from '../stores/useReadoutStore';
import { useViewStore } from '../stores/useViewStore';

const zoomAtPointer = (percent: number): void => {
  const { viewport } = useViewStore.getState();
  const { pointer } = useReadoutStore.getState();
  if (!viewport) return;
  viewport.setZoom(percent / 100, pointer ? viewport.pixelToScreen(pointer.x + 0.5, pointer.y + 0.5) : undefined);
};

export { zoomAtPointer };
