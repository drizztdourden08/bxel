/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { PROJECT_SOURCE } from '../../project-config/project-source.constants';
import { showProject } from '../../project-config/show-project';

const meta: ScreenMeta = {
  title: 'Assistant',
  icon: 'plug-zap',
  order: 5,
  source: PROJECT_SOURCE,
  when: showProject(true),
  keywords: ['assistant', 'access', 'folders', 'read only', 'edit', 'mcp'],
};

const sections: Section[] = [
  {
    id: 'access',
    title: 'Access',
    items: [
      {
        key: 'project.access',
        label: 'Assistant access',
        description: 'Whether an assistant program may browse this project.',
        hint: 'The choice is kept for this copy of the project.',
      },
      {
        key: 'project.assistantFolders',
        label: 'Folders an assistant can see',
        description: 'Leave every folder on to let it see the whole project.',
      },
    ],
  },
];

export default sections;
export { meta };
