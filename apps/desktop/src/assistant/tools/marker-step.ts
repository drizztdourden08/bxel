/* @layer renderer-app @kind logic */
import { useMarkerStore } from '../../stores/useMarkerStore';
import { MARKER_MS } from './marker-step.constants';
import type { ViewStep } from './view-steps.type';

const markerStep: ViewStep = (patch) => {
  const { marker } = patch;
  if (marker === undefined) return null;
  const { setMarker } = useMarkerStore.getState();
  if (marker === null) {
    setMarker(null);
    return null;
  }
  const until = Date.now() + marker.seconds * MARKER_MS;
  setMarker({ rect: marker.rect, label: marker.label ?? '', until });
  window.setTimeout(() => {
    if (useMarkerStore.getState().marker?.until === until) setMarker(null);
  }, marker.seconds * MARKER_MS);
  return null;
};

export { markerStep };
