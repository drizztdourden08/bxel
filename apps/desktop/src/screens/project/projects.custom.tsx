/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { ProjectList } from '../../views/ProjectList';

const meta: ScreenMeta = {
  title: 'Projects',
  icon: 'folder',
  order: 1,
  keywords: ['project', 'projects', 'recent', 'open', 'new', 'remove', 'list'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Manage projects', keywords: ['project', 'recent', 'open', 'new', 'remove', 'list'] },
];

const ProjectsScreen = () => <ProjectList />;

export default ProjectsScreen;
export { meta, searchEntries };
