/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { CANVAS_TEXT, useCanvasItems } from '../views/CanvasToolbar';
import { ToolbarPanel } from '../views/ToolbarPanel';

const meta: WidgetMeta = { label: 'Canvas', icon: 'image', defaultSide: 'right', defaultDockedSize: 232, popOut: false };

const CanvasWidget = () => <ToolbarPanel label={CANVAS_TEXT.region} items={useCanvasItems()} />;

export default CanvasWidget;
export { meta };
