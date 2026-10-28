/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../../stores/useProjectStore';
import { ProjectBrowser } from '../../views/ProjectBrowser';
import { ProjectList } from '../../views/ProjectList';

const meta: ScreenMeta = {
  title: 'Browse',
  icon: 'folder-open',
  order: 0,
  fill: true,
  bare: true,
  showHeader: false,
  keywords: ['browse', 'files', 'folders', 'grid', 'list', 'columns', 'search', 'preview', 'move', 'rename', 'new', 'import', 'project'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Browse the project files', keywords: ['files', 'folders', 'grid', 'list', 'columns', 'preview'] },
  { label: 'Search the project', keywords: ['kind:', 'is:unsaved', 'is:unused', 'in:', 'uses:', 'usedby:', 'size>', 'colours<'] },
];

const BrowseScreen = () => {
  const project = useProjectStore((state) => state.project);
  return project === null ? <ProjectList /> : <ProjectBrowser project={project} disk={null} />;
};

export default BrowseScreen;
export { meta, searchEntries };
