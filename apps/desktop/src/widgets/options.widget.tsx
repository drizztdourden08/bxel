/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Toolbar } from '@drizztdourden08/tessera';
import { OPTIONS_TEXT, useOptionsItems } from '../views/OptionsToolbar';

const meta: WidgetMeta = { label: 'Tool options', icon: 'sliders-horizontal', defaultSide: 'right', defaultDockedSize: 232, popOut: false, defaultVisibility: 'context-only' };

const OptionsWidget = () => <Toolbar layout="list" label={OPTIONS_TEXT.region} items={useOptionsItems()} />;

export default OptionsWidget;
export { meta };
