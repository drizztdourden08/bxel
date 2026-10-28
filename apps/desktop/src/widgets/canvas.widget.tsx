/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { ViewPanel, VIEW_PANEL_TEXT } from '../views/ViewPanel';

const meta: WidgetMeta = { label: VIEW_PANEL_TEXT.region, icon: 'image', defaultOpen: true, defaultSide: 'right', defaultDockedSize: 264, dockWeight: 2, fill: true, popOut: true, defaultVisibility: 'context-only', context: WIDGET_CONTEXT.view };

const CanvasWidget = () => <ViewPanel />;

export default CanvasWidget;
export { meta };
