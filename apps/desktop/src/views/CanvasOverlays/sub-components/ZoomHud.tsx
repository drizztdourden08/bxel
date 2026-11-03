/* @layer renderer-app @kind component */
import { TransientReadout } from '@drizztdourden08/tessera';
import { zoomView } from '../../../editor/zoom-view';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { CANVAS_OVERLAY_TEXT } from '../CanvasOverlays.constants';

const resetZoom = (): void => zoomView('fit');

const ZoomHud = () => {
  const zoom = useReadoutStore((state) => state.zoom);
  return <TransientReadout value={CANVAS_OVERLAY_TEXT.percent(zoom)} corner="bottom-end" onActivate={resetZoom} title={CANVAS_OVERLAY_TEXT.hudReset} />;
};

export { ZoomHud };
