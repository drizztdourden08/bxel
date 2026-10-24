/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';
import { packCurrentProject } from '../../project/pack-current-project';

const meta: ScreenMeta = {
  title: 'General',
  icon: 'folder',
  order: 1,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['project', 'name', 'cover', 'picture', 'pack', 'share', 'zip'],
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
  {
    id: 'share',
    title: 'Share',
    items: [
      {
        key: 'project.pack',
        label: 'Pack the project',
        description: 'Put the project and every file in it into one file you can share.',
        hint: 'Unsaved changes are saved first. The packed file is a copy. The project stays where it is.',
        actions: [{ id: 'pack', label: 'Pack project...', icon: 'package', onSelect: () => void packCurrentProject() }],
      },
    ],
  },
];

export default sections;
export { meta };
