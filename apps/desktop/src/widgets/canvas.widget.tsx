/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Toolbar } from '@drizztdourden08/tessera';
import { CANVAS_TEXT, useCanvasItems } from '../views/CanvasToolbar';

const meta: WidgetMeta = { label: 'Canvas', icon: 'image', defaultSide: 'right', defaultDockedSize: 232, popOut: false };

const CanvasWidget = () => <Toolbar layout="list" label={CANVAS_TEXT.region} items={useCanvasItems()} />;

export default CanvasWidget;
export { meta };
