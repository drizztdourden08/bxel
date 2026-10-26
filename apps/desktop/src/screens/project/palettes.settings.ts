/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'Palettes',
  icon: 'palette',
  order: 4,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['palettes', 'palette files', 'import', 'gpl', 'pal', 'hex', 'export', 'library'],
};

const sections: Section[] = [
  {
    id: 'palettes',
    title: 'Palette files',
    items: [
      {
        key: 'project.palettes', layout: 'wide',
        label: 'Project palettes',
        description: 'Palette files shared by the sprites of the project. Editing one recolours every sprite that uses it.',
        hint: 'Which palette a sprite uses is chosen in the Asset settings.',
      },
    ],
  },
];

export default sections;
export { meta };
