/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Toolbar } from '@drizztdourden08/tessera';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { TOOL_RAIL_TEXT, useRailItems } from '../views/ToolRail';

const meta: WidgetMeta = { label: 'Tools', icon: 'wrench', defaultSide: 'right', defaultDockedSize: 232, popOut: false, defaultVisibility: 'context-only', context: WIDGET_CONTEXT.tools };

const ToolsWidget = () => <Toolbar layout="list" label={TOOL_RAIL_TEXT.region} items={useRailItems()} />;

export default ToolsWidget;
export { meta };
