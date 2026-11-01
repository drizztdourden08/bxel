/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { zoomView } from '../../../editor/zoom-view';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { CANVAS_OVERLAY_TEXT } from '../CanvasOverlays.constants';
import { useHudVisible } from '../behavior/useHudVisible';

const ZoomHud = () => {
  const zoom = useReadoutStore((state) => state.zoom);
  const visible = useHudVisible(zoom);
  return (
    <Text
      as="span"
      className="canvas-overlays__hud"
      data-visible={visible ? '' : undefined}
      title={CANVAS_OVERLAY_TEXT.hudReset}
      aria-hidden="true"
      onDoubleClick={() => zoomView('fit')}
    >
      {CANVAS_OVERLAY_TEXT.percent(zoom)}
    </Text>
  );
};

export { ZoomHud };
