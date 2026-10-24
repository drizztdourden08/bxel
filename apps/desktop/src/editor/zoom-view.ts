/* @layer renderer-app @kind logic */
import { useViewStore } from '../stores/useViewStore';
import type { ZoomStep } from './editor.type';

const zoomView = (step: ZoomStep): void => {
  const { viewport } = useViewStore.getState();
  if (!viewport) return;
  if (step === 'in') viewport.zoomIn();
  else if (step === 'out') viewport.zoomOut();
  else if (step === 'fit') viewport.fit();
  else viewport.setZoom(1);
};

export { zoomView };
