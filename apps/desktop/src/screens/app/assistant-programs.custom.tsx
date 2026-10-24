/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { AssistantPanel } from '../../views/AssistantPanel';

const meta: ScreenMeta = { title: 'Assistant programs', showHeader: true, icon: 'plug', order: 6, keywords: ['mcp', 'assistant', 'approve', 'remember', 'allow all', 'client config', 'disconnect'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Approving connections', keywords: ['assistant', 'mcp', 'approve', 'allow all', 'prompt'] },
  { label: 'Remembered programs', keywords: ['assistant', 'forget', 'blocked', 'program'] },
  { label: 'Copy client config', keywords: ['assistant', 'mcp', 'config', 'client', 'stdio'] },
];

const AssistantProgramsScreen = () => <AssistantPanel />;

export default AssistantProgramsScreen;
export { meta, searchEntries };
