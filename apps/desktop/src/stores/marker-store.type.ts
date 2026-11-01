/* @layer renderer-app @kind types */
interface Marker {
  rect: { x: number; y: number; width: number; height: number };
  label: string;
  until: number;
}

interface MarkerState {
  marker: Marker | null;
  setMarker: (marker: Marker | null) => void;
}

export type { Marker, MarkerState };
