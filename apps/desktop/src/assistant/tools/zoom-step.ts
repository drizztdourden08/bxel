/* @layer renderer-app @kind logic */
import { useViewStore } from '../../stores/useViewStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const zoomStep: ViewStep = (patch) => {
  const { zoom } = patch;
  if (zoom === undefined) return null;
  const { viewport } = useViewStore.getState();
  if (!viewport) return viewFail(APP_TOOL_TEXT.noViewport, 'zoom');
  if (zoom === 'fit') viewport.fit();
  else if (zoom === 'actual') viewport.setZoom(1);
  else if (typeof zoom === 'number') viewport.setZoom(zoom / 100);
  else {
    const { rect } = zoom;
    const view = viewport.view();
    viewport.setZoom(Math.min(view.width / rect.width, view.height / rect.height));
    viewport.panTo({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  }
  return null;
};

export { zoomStep };
