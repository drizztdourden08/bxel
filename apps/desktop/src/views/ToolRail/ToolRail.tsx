/* @layer renderer-app @kind component */
import { SlotToolbar } from '../SlotToolbar';
import { useRailItems } from './behavior/useRailItems';
import { TOOL_RAIL_TEXT } from './ToolRail.constants';
import type { ToolRailProps } from './ToolRail.type';

const ToolRail = ({ slot }: ToolRailProps) => {
  const items = useRailItems();
  return <SlotToolbar label={TOOL_RAIL_TEXT.region} items={items} slot={slot} />;
};

export { ToolRail };
