/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { TOOLS } from '../../../editor/tools.constants';
import { useMapPlacing } from '../../../hooks/useMapPlacing';
import { useToolIcon } from '../../../hooks/useToolIcon';
import { TOOL_ICONS } from '../../../icons/tool-icons.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOLS } from '../../../tilemap/map-tools.constants';
import { railItems } from './rail-items';
import { useSelectOptions } from './useSelectOptions';
import { useShapeOptions } from './useShapeOptions';
import { useToolKeys } from './useToolKeys';

const useRailItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const pick = useToolStore((state) => state.selectTool);
  const placing = useMapPlacing();
  const shapeIcon = useToolIcon('shape');
  const selectIcon = useToolIcon('select');
  const keys = useToolKeys();
  const menus = { shape: useShapeOptions(), select: useSelectOptions() };
  const icons = placing ? TOOL_ICONS : { ...TOOL_ICONS, shape: shapeIcon, select: selectIcon };
  return railItems({ tool, pick, keys, icons, defs: placing ? MAP_TOOLS : TOOLS, options: placing ? {} : menus });
};

export { useRailItems };
