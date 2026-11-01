/* @layer renderer-app @kind logic */
import { ACTUAL_ZOOM, NO_CONTROL, NO_CONTROLS } from './split-view.constants';
import type { SplitControls, SplitFollow, SplitMode, ViewControl } from './split-view.type';

const splitControls = (mode: SplitMode, follow: SplitFollow): SplitControls => {
  if (!mode.split) return NO_CONTROLS;
  const panned: ViewControl = mode.link ? { pan: follow.shared?.pan, onPanChange: follow.onPan } : NO_CONTROL;
  const zoomed: ViewControl = mode.link ? { zoom: follow.shared?.zoom, onZoomChange: follow.onZoom } : NO_CONTROL;
  const first: ViewControl = mode.actual ? panned : { ...panned, ...zoomed };
  const second: ViewControl = mode.actual ? { ...panned, zoom: ACTUAL_ZOOM, zoomLocked: true } : first;
  return { first, second };
};

export { splitControls };
