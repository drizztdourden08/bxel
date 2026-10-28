/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../../project-config/project-source.constants';
import { showProject } from '../../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'Export',
  icon: 'upload',
  order: 6,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['export', 'scale', 'path', 'template', 'file name', 'png', 'sprite', 'frame'],
};

const sections: Section[] = [
  {
    id: 'export',
    title: 'Export defaults',
    items: [
      {
        key: 'project.export.scale',
        label: 'Default scale',
        description: 'The scale the Export window starts with in this project.',
        hint: 'Whole numbers 1 to 8. The window still lets you change it for one export.',
        control: { kind: 'number', min: 1, max: 8, step: 1, unit: 'x' },
      },
      {
        key: 'project.export.pathTemplate',
        label: 'File name template',
        description: 'How exported image files are named. Leave it empty for the usual names.',
        hint: 'Use {name} for the name typed in the window, {sprite} for the sprite and {frame} for the frame number. Example: {sprite}-{frame}.',
        control: { kind: 'text', placeholder: '{sprite}-{frame}' },
      },
    ],
  },
];

export default sections;
export { meta };
