/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../../hooks/useMapPlacing';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOL_OPTIONS, TOOL_OPTIONS } from '../OptionsToolbar.constants';
import { joinOptions } from './join-options';
import { useOptionItems } from './useOptionItems';
import { useTileModeItems } from './useTileModeItems';

const useOptionsItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const placing = useMapPlacing();
  const items = useOptionItems();
  const mode = useTileModeItems();
  const kinds = placing ? MAP_TOOL_OPTIONS[tool] : TOOL_OPTIONS[tool];
  const options = joinOptions(kinds, items);
  const gap = mode.length > 0 && options.length > 0 ? [{ kind: 'separator' as const, id: 'after-tile-mode' }] : [];
  return [...mode, ...gap, ...options];
};

export { useOptionsItems };
