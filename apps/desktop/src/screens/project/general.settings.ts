/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'General',
  icon: 'folder',
  order: 1,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['project', 'name', 'cover', 'picture'],
};

const sections: Section[] = [
  {
    id: 'project',
    title: 'Project',
    items: [
      {
        key: 'project.name',
        label: 'Name',
        description: 'The name of the project.',
        hint: 'The project file keeps its own file name.',
        control: { kind: 'text', placeholder: 'Project name' },
      },
      {
        key: 'project.cover',
        label: 'Cover',
        description: 'The sprite that stands for the project in lists.',
        hint: 'Only sprites that are saved in the project can be the cover.',
      },
    ],
  },
];

export default sections;
export { meta };
