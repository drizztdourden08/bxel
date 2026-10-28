/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { useMapPlacing } from '../hooks/useMapPlacing';
import { LayersPanel } from '../views/LayersPanel';
import { MapLayersPanel } from '../views/MapLayersPanel';

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

const LayersWidget = () => (useMapPlacing() ? <MapLayersPanel /> : <LayersPanel />);

export default LayersWidget;
export { meta };
