/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { TimelinePanel } from '../views/TimelinePanel';

const meta: WidgetMeta = {
  label: 'Timeline',
  icon: 'rows-3',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 240,
  popOut: false,
};

const TimelineWidget = () => <TimelinePanel />;

export default TimelineWidget;
export { meta };
