/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { AssistantProjects } from '../../views/AssistantProjects';

const meta: ScreenMeta = { title: 'Assistant projects', showHeader: true, icon: 'folder-open', order: 7, keywords: ['mcp', 'assistant', 'project', 'grant', 'browse', 'folder', 'read only', 'edit'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Let the assistant browse a project', keywords: ['assistant', 'project', 'grant', 'folder', 'access'] },
  { label: 'Project assistant access', keywords: ['assistant', 'project', 'read only', 'edit', 'off'] },
];

const AssistantProjectsScreen = () => <AssistantProjects />;

export default AssistantProjectsScreen;
export { meta, searchEntries };
