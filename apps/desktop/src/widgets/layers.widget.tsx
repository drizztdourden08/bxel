/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { LayerStack } from '../views/LayerStack';

const meta: WidgetMeta = {
  label: 'Layers',
  icon: 'layers',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 280,
  dockWeight: 1,
  fill: true,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.layers,
};

export default LayerStack;
export { meta };
