/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { OptionsPanel } from '../views/OptionsPanel';

const meta: WidgetMeta = {
  label: 'Tool options',
  icon: 'sliders-horizontal',
  defaultSide: 'right',
  defaultDockedSize: 288,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.options,
};

const OptionsWidget = () => <OptionsPanel />;

export default OptionsWidget;
export { meta };
