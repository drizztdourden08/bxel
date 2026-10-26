/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { TimelinePanel } from '../views/TimelinePanel';

const meta: WidgetMeta = {
  label: 'Timeline',
  icon: 'rows-3',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 240,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.paint,
};

const TimelineWidget = () => <TimelinePanel />;

export default TimelineWidget;
export { meta };
