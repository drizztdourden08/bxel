/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { TilesetModeSwitch, TilesetPanel } from '../views/TilesetPanel';

const meta: WidgetMeta = {
  label: 'Tileset',
  icon: 'puzzle',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 280,
  fill: true,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.tileset,
  tools: TilesetModeSwitch,
};

const TilesetWidget = () => <TilesetPanel />;

export default TilesetWidget;
export { meta };
