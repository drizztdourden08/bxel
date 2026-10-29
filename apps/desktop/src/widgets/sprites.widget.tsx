/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { WIDGET_CONTEXT } from '../ui-context/widget-context.constants';
import { SpritesPanel } from '../views/SpritesPanel';
import { SheetEmpty } from '../views/SpritesPanel/sub-components/SheetEmpty';

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
  empty: SheetEmpty,
};

const SpritesWidget = () => <SpritesPanel />;

export default SpritesWidget;
export { meta };
