/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { ProjectHealth } from '../../views/ProjectHealth';

const meta: ScreenMeta = {
  title: 'Health',
  icon: 'heart',
  order: 1,
  fill: true,
  showHeader: false,
  keywords: ['health', 'broken', 'link', 'links', 'missing', 'unused', 'repair', 'fix', 'duplicate', 'moved', 'problems', 'check'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Check the project health', keywords: ['broken links', 'unused files', 'misplaced', 'duplicates', 'repair', 'fix'] },
  { label: 'Repair broken links', keywords: ['link', 'missing', 'moved', 'find by id', 'fix all'] },
];

const HealthScreen = () => <ProjectHealth />;

export default HealthScreen;
export { meta, searchEntries };
