/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SpritesPanel } from '../views/SpritesPanel';

const meta: WidgetMeta = {
  label: 'Sprites',
  icon: 'images',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 168,
  popOut: false,
};

const SpritesWidget = () => <SpritesPanel />;

export default SpritesWidget;
export { meta };
