/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { ViewPanel, VIEW_PANEL_TEXT } from '../views/ViewPanel';

const meta: WidgetMeta = { label: VIEW_PANEL_TEXT.region, icon: 'image', defaultSide: 'right', defaultDockedSize: 264, popOut: true, defaultVisibility: 'context-only' };

const CanvasWidget = () => <ViewPanel />;

export default CanvasWidget;
export { meta };
