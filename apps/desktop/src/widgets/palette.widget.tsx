/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { PalettePanel } from '../views/PalettePanel';

const meta: WidgetMeta = { label: 'Palette', icon: 'palette', defaultSide: 'right', defaultDockedSize: 280, dockWeight: 2, fill: true, popOut: false, defaultVisibility: 'context-only', context: WIDGET_CONTEXT.palette };

const PaletteWidget = () => <PalettePanel />;

export default PaletteWidget;
export { meta };
