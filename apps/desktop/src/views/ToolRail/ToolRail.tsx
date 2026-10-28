/* @layer renderer-app @kind component */
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { SlotToolbar } from '../SlotToolbar';
import { useRailHold } from './behavior/useRailHold';
import { useRailItems } from './behavior/useRailItems';
import { useRailMenu } from './behavior/useRailMenu';
import { TOOL_RAIL_TEXT } from './ToolRail.constants';
import type { ToolRailProps } from './ToolRail.type';
import './ToolRail.css';

const ToolRail = ({ slot }: ToolRailProps) => {
  const items = useRailItems();
  const hold = useRailHold(slot);
  useRailMenu();
  return (
    <Box className="tool-rail" {...contextMenuZone(TOOL_RAIL_TEXT.zone)} {...hold}>
      <SlotToolbar label={TOOL_RAIL_TEXT.region} items={items} slot={slot} />
    </Box>
  );
};

export { ToolRail };
