/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SpritesPanel } from '../views/SpritesPanel';

const meta: WidgetMeta = {
  label: 'Sheet',
  icon: 'images',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 340,
  popOut: false,
};

const SpritesWidget = () => <SpritesPanel />;

export default SpritesWidget;
export { meta };
