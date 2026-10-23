/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';

const zoomAt = (target: ViewTarget, zoom: number, anchor: PixelPoint, box: ViewBox): ViewTarget => {
  const fromCentreX = anchor.x - box.width / 2;
  const fromCentreY = anchor.y - box.height / 2;
  const underX = target.pan.x + fromCentreX / target.zoom;
  const underY = target.pan.y + fromCentreY / target.zoom;
  return { zoom, pan: { x: underX - fromCentreX / zoom, y: underY - fromCentreY / zoom } };
};

export { zoomAt };
