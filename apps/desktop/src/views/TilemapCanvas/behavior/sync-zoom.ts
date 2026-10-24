/* @layer renderer-app @kind logic */
import { useReadoutStore } from '../../../stores/useReadoutStore';

const syncZoom = (zoom: number): void => {
  const readout = useReadoutStore.getState();
  if (readout.zoom !== zoom) readout.setZoom(zoom);
};

export { syncZoom };
