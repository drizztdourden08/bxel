/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { TOOLS } from '../../../editor/tools.constants';
import { useMapPlacing } from '../../../hooks/useMapPlacing';
import { useSurface } from '../../../hooks/useSurface';
import { useToolIcon } from '../../../hooks/useToolIcon';
import { MAP_TOOL_ICONS, TOOL_ICONS } from '../../../icons/tool-icons.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { MAP_TOOLS } from '../../../tilemap/map-tools.constants';
import { railItems } from './rail-items';
import { toolsOf } from './tools-of';
import { useSelectOptions } from './useSelectOptions';
import { useToolKeys } from './useToolKeys';

const useRailItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const pick = useToolStore((state) => state.selectTool);
  const placing = useMapPlacing();
  const surface = useSurface();
  const rectIcon = useToolIcon('rect');
  const ellipseIcon = useToolIcon('ellipse');
  const selectIcon = useToolIcon('select');
  const keys = useToolKeys();
  const menus = { select: useSelectOptions() };
  const icons = placing ? MAP_TOOL_ICONS : { ...TOOL_ICONS, rect: rectIcon, ellipse: ellipseIcon, select: selectIcon };
  return railItems({ tool, pick, keys, icons, defs: toolsOf(surface, placing ? MAP_TOOLS : TOOLS), options: placing || surface === 'sheet' ? {} : menus });
};

export { useRailItems };
