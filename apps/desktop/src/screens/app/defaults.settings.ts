/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = {
  title: 'Defaults for new assets',
  icon: 'sliders-horizontal',
  order: 4.4,
  keywords: ['defaults', 'new asset', 'new sprite', 'size', 'colour limit', 'palette', 'platform', 'strict', 'transparent', 'frame time'],
};

const sections: Section[] = [
  {
    id: 'defaults',
    title: 'New sprites',
    items: [
      { key: 'app.default.size', label: 'Size', description: 'The size of a new sprite.', hint: 'A project can set its own. Changing a default never changes an asset that exists.' },
      { key: 'app.default.colorLimit', label: 'Colour limit', description: 'The slots of a new palette.' },
      { key: 'app.default.palette', label: 'Palette', description: 'The palette a new sprite starts with.' },
      { key: 'app.default.transparent', label: 'Transparent slot', description: 'Slot 0 of a new palette is transparent.' },
      { key: 'app.default.frameDurationMs', label: 'Frame time', description: 'How long a new frame shows.' },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      { key: 'app.default.platformId', label: 'Platform', description: 'The target a new sprite is made for.', hint: 'A project with its own platform wins over this one.' },
      { key: 'app.default.platformStrict', label: 'Enforce platform rules', description: 'Block a change that would break a rule marked Outside the rules.' },
    ],
  },
];

export default sections;
export { meta };
