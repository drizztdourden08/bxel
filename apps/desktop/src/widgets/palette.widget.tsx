/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { PalettePanel } from '../views/PalettePanel';

const meta: WidgetMeta = { label: 'Palette', icon: 'palette', defaultSide: 'right', defaultDockedSize: 280, dockWeight: 2, fill: true, popOut: false, defaultVisibility: 'context-only' };

const PaletteWidget = () => <PalettePanel />;

export default PaletteWidget;
export { meta };
