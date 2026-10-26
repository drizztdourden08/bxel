/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { PalettePanel } from '../views/PalettePanel';

<<<<<<< HEAD
const meta: WidgetMeta = { label: 'Palette', icon: 'palette', defaultSide: 'right', defaultDockedSize: 280, fill: true, popOut: false, defaultVisibility: 'context-only', context: WIDGET_CONTEXT.paint };
=======
const meta: WidgetMeta = { label: 'Palette', icon: 'palette', defaultSide: 'right', defaultDockedSize: 280, dockWeight: 2, fill: true, popOut: false, defaultVisibility: 'context-only' };
>>>>>>> main

const PaletteWidget = () => <PalettePanel />;

export default PaletteWidget;
export { meta };
