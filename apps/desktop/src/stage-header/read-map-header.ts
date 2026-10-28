/* @layer renderer-app @kind logic */
import type { CellFlags, MapLayer } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';
import type { MapContext } from '../tilemap/tilemap.type';
import { stateOf } from './read-sprite-header';
import type { MapHeader } from './stage-header.type';

interface MapFlags {
  flags: CellFlags;
  selection: MapSelection | null;
  showTurn: boolean;
  showSelection: boolean;
}

const turnText = (flags: CellFlags): string | null => {
  const parts = [flags.flipX ? 'X' : '', flags.flipY ? 'Y' : '', flags.diagonal ? 'Diagonal' : ''].filter(Boolean);
  return parts.length === 0 ? null : parts.join(' ');
};

const layerStateOf = (layer: MapLayer | null): MapHeader['layerState'] => (layer ? stateOf(layer) : '');

const readMapHeader = (context: MapContext | null, extras: MapFlags): MapHeader => ({
  mapName: context?.tilemap?.name ?? null,
  layerId: context?.layer?.id ?? null,
  layerName: context?.layer?.name ?? null,
  layerState: layerStateOf(context?.layer ?? null),
  turn: extras.showTurn ? turnText(extras.flags) : null,
  selection: extras.showSelection && extras.selection ? `${extras.selection.rect.width} x ${extras.selection.rect.height} cells selected` : null,
});

export type { MapFlags };
export { readMapHeader };
