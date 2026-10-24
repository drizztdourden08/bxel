/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'Defaults for new assets',
  icon: 'sliders-horizontal',
  order: 3,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['defaults', 'new asset', 'size', 'colour limit', 'palette', 'platform', 'strict', 'transparent', 'frame time', 'inherit'],
};

const sections: Section[] = [
  {
    id: 'defaults',
    title: 'New sprites in this project',
    items: [
      { key: 'project.default.size', label: 'Size', description: 'The size of a new sprite.', hint: 'Changing a default never changes an asset that exists.' },
      { key: 'project.default.colorLimit', label: 'Colour limit', description: 'The slots of a new palette.' },
      { key: 'project.default.palette', label: 'Palette', description: 'The palette a new sprite starts with.', hint: 'A palette file of the project is shared by every sprite that uses it.' },
      { key: 'project.default.transparent', label: 'Transparent slot', description: 'Slot 0 of a new palette is transparent.' },
      { key: 'project.default.frameDurationMs', label: 'Frame time', description: 'How long a new frame shows.' },
      { key: 'project.default.pixelGrid', label: 'Pixel grid', description: 'The grid cell a new sprite is saved with.', hint: '1 by 1 draws a line between every pixel. A sprite keeps its own grid.' },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      {
        key: 'project.default.platformId',
        label: 'Platform',
        description: 'The target of the project. A sprite with no platform of its own follows it.',
        hint: 'This one is live. Changing it changes the rules for every sprite that follows the project.',
      },
      { key: 'project.default.platformStrict', label: 'Enforce platform rules', description: 'Block a change that would break a rule marked Outside the rules.' },
    ],
  },
];

export default sections;
export { meta };
