/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { PalettePanel } from '../views/PalettePanel';

const meta: WidgetMeta = { label: 'Palette', icon: 'palette', defaultSide: 'right', defaultDockedSize: 232, popOut: false, defaultVisibility: 'context-only' };

const PaletteWidget = () => <PalettePanel />;

export default PaletteWidget;
export { meta };
