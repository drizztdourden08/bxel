/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { TransformPanel } from '../views/TransformPanel';

const meta: WidgetMeta = {
  label: 'Transform',
  icon: 'move',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 232,
  popOut: false,
};

const TransformWidget = () => <TransformPanel />;

export default TransformWidget;
export { meta };
