/* @layer renderer-app @kind hook */
import { useMapContext } from '../../../hooks/useMapContext';
import { useCanvasSurface } from '../../../canvas-surface/useCanvasSurface';
import { readMapHeader } from '../../../stage-header/read-map-header';
import type { MapHeader } from '../../../stage-header/stage-header.type';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOL_OPTIONS } from '../../OptionsToolbar/OptionsToolbar.constants';

const useMapHeader = (): MapHeader | null => {
  const surface = useCanvasSurface();
  const map = useMapContext();
  const kinds = useToolStore((state) => MAP_TOOL_OPTIONS[state.tool]);
  const flags = useTilemapStore((state) => state.flags);
  const selection = useTilemapStore((state) => state.selection);
  if (surface !== 'map') return null;
  return readMapHeader(map, { flags, selection, showTurn: kinds.includes('mapFlags'), showSelection: kinds.includes('mapSelection') });
};

export { useMapHeader };
