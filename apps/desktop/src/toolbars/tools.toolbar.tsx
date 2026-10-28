/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { TOOLBAR_FLAG } from '../ui-context/widget-context.constants';
import { TOOL_RAIL_TEXT, ToolRail } from '../views/ToolRail';

export default defineToolbar({
  id: 'tools',
  label: TOOL_RAIL_TEXT.region,
  defaultSide: 'left',
  when: { when: (ctx) => ctx.flags[TOOLBAR_FLAG.tools] !== false },
  render: (slot) => <ToolRail slot={slot} />,
});
