/* @layer renderer-app @kind logic */
import { useViewStore } from '../../stores/useViewStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const panStep: ViewStep = (patch) => {
  const { pan } = patch;
  if (!pan) return null;
  const { viewport } = useViewStore.getState();
  if (!viewport) return viewFail(APP_TOOL_TEXT.noViewport, 'pan');
  viewport.panTo({ x: pan.centreX, y: pan.centreY });
  return null;
};

export { panStep };
