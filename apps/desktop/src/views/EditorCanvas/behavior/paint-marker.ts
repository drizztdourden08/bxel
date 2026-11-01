/* @layer renderer-app @kind logic */
import { useMarkerStore } from '../../../stores/useMarkerStore';
import type { PixelView } from '../../PixelViewport';
import { MARKER_DASH } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const paintMarker = (ctx: CanvasRenderingContext2D, view: PixelView, look: OverlayLook): void => {
  const { marker } = useMarkerStore.getState();
  if (!marker) return;
  const { rect } = marker;
  ctx.save();
  ctx.strokeStyle = look.cursor;
  ctx.lineWidth = 2 / view.zoom;
  ctx.setLineDash(MARKER_DASH.map((part) => part / view.zoom));
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  if (marker.label !== '') {
    ctx.setLineDash([]);
    ctx.fillStyle = look.cursor;
    ctx.font = `${12 / view.zoom}px sans-serif`;
    ctx.fillText(marker.label, rect.x, rect.y - 3 / view.zoom);
  }
  ctx.restore();
};

export { paintMarker };
