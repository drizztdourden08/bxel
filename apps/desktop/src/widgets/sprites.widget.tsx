/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { SpritesPanel } from '../views/SpritesPanel';

const meta: WidgetMeta = {
  label: 'Sheet',
  icon: 'pixel-atlas',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 340,
  fill: true,
  popOut: false,
  defaultVisibility: 'context-only',
  context: WIDGET_CONTEXT.sheet,
};

const SpritesWidget = () => <SpritesPanel />;

export default SpritesWidget;
export { meta };
