/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { ToolsPanel } from '../views/ToolsPanel';

const meta: WidgetMeta = {
  label: 'Tools',
  icon: 'wrench',
  defaultSide: 'right',
  defaultDockedSize: 280,
  dockWeight: 2,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.tools,
};

const ToolsWidget = () => <ToolsPanel />;

export default ToolsWidget;
export { meta };
