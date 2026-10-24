/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LayersPanel } from '../views/LayersPanel';

const meta: WidgetMeta = {
  label: 'Layers',
  icon: 'layers',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 232,
  popOut: false,
};

const LayersWidget = () => <LayersPanel />;

export default LayersWidget;
export { meta };
