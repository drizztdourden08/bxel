/* @layer renderer-app @kind logic */
import type { MapContext } from '../tilemap/tilemap.type';
import { mapLayerHeader } from './map-layer-header';
import type { MapFlags } from './read-map-header.type';
import type { MapHeader } from './stage-header.type';
import { turnText } from './turn-text';

const selectionText = (extras: MapFlags): string | null => {
  const rect = extras.showSelection ? extras.selection?.rect : undefined;
  return rect ? `${rect.width} x ${rect.height} cells selected` : null;
};

const readMapHeader = (context: MapContext | null, extras: MapFlags): MapHeader => ({
  mapName: context?.tilemap?.name ?? null,
  ...mapLayerHeader(context?.layer),
  turn: extras.showTurn ? turnText(extras.flags) : null,
  selection: selectionText(extras),
});

export { readMapHeader };
