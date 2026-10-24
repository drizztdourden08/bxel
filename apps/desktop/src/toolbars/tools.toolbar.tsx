/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { TOOL_RAIL_TEXT, ToolRail } from '../views/ToolRail';

export default defineToolbar({
  id: 'tools',
  label: TOOL_RAIL_TEXT.region,
  defaultSide: 'left',
  render: (slot) => <ToolRail slot={slot} />,
});
