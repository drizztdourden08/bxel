/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { ProjectManager } from '../../views/ProjectManager';

const meta: ScreenMeta = {
  title: 'Projects',
  showHeader: true,
  icon: 'folder-open',
  order: 0,
  keywords: ['project', 'projects', 'manager', 'recent', 'open', 'new', 'remove', 'assets', 'duplicate', 'rename', 'delete'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Manage projects', keywords: ['project', 'recent', 'open', 'new', 'remove', 'list'] },
  { label: 'Project assets', keywords: ['asset', 'sprite', 'sheet', 'palette', 'duplicate', 'rename', 'delete', 'new asset'] },
];

const ProjectsScreen = () => <ProjectManager />;

export default ProjectsScreen;
export { meta, searchEntries };
