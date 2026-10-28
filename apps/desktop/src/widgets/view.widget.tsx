/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { ViewPanel, VIEW_PANEL_TEXT } from '../views/ViewPanel';

const meta: WidgetMeta = { label: VIEW_PANEL_TEXT.region, icon: 'image', defaultSide: 'left', defaultDockedSize: 260, dockWeight: 0.2, fill: true, popOut: true, defaultVisibility: 'context-only', context: WIDGET_CONTEXT.view };

const ViewWidget = () => <ViewPanel />;

export default ViewWidget;
export { meta };
