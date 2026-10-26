/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'Folders',
  icon: 'folder-open',
  order: 2,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['folders', 'linked', 'roles', 'sprites', 'sheets', 'palettes', 'tilemaps', 'exports'],
};

const sections: Section[] = [
  {
    id: 'folders',
    title: 'Folders and roles',
    items: [
      {
        key: 'project.folders', layout: 'wide',
        label: 'Folders',
        description: 'The project folder, the folders linked to it and where each kind of asset goes.',
        hint: 'A new asset is written to the folder of its kind. Leave a role empty to use the folder itself.',
      },
    ],
  },
];

export default sections;
export { meta };
