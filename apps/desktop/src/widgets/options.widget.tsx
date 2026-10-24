/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { OPTIONS_TEXT, useOptionsItems } from '../views/OptionsToolbar';
import { ToolbarPanel } from '../views/ToolbarPanel';

const meta: WidgetMeta = { label: 'Tool options', icon: 'sliders-horizontal', defaultSide: 'right', defaultDockedSize: 232, popOut: false };

const OptionsWidget = () => <ToolbarPanel label={OPTIONS_TEXT.region} items={useOptionsItems()} />;

export default OptionsWidget;
export { meta };
