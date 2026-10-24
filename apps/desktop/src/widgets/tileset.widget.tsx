/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { TilesetPanel } from '../views/TilesetPanel';

const meta: WidgetMeta = {
  label: 'Tileset',
  icon: 'puzzle',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 260,
  popOut: false,
};

const TilesetWidget = () => <TilesetPanel />;

export default TilesetWidget;
export { meta };
