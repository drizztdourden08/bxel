/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { ToolbarPanel } from '../views/ToolbarPanel';
import { TOOL_RAIL_TEXT, useRailItems } from '../views/ToolRail';

const meta: WidgetMeta = { label: 'Tools', icon: 'wrench', defaultSide: 'right', defaultDockedSize: 232, popOut: false };

const ToolsWidget = () => <ToolbarPanel label={TOOL_RAIL_TEXT.region} items={useRailItems()} />;

export default ToolsWidget;
export { meta };
