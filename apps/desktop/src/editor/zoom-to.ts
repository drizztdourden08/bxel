/* @layer renderer-app @kind logic */
import { useViewStore } from '../stores/useViewStore';

const zoomTo = (percent: number): void => useViewStore.getState().viewport?.setZoom(percent / 100);

export { zoomTo };
