/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useToolIcon } from '../../../hooks/useToolIcon';
import { TOOL_ICONS } from '../../../icons/tool-icons.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { railItems } from './rail-items';
import { useSelectOptions } from './useSelectOptions';
import { useShapeOptions } from './useShapeOptions';
import { useToolKeys } from './useToolKeys';

const useRailItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const pick = useToolStore((state) => state.selectTool);
  const shapeIcon = useToolIcon('shape');
  const selectIcon = useToolIcon('select');
  const keys = useToolKeys();
  const options = { shape: useShapeOptions(), select: useSelectOptions() };
  return railItems({ tool, pick, keys, options, icons: { ...TOOL_ICONS, shape: shapeIcon, select: selectIcon } });
};

export { useRailItems };
