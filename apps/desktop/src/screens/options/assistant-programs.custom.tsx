/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { AssistantPanel } from '../../views/AssistantPanel';

const meta: ScreenMeta = { title: 'Assistant programs', showHeader: true, icon: 'plug', order: 6, keywords: ['mcp', 'assistant', 'approve', 'remember', 'allow all', 'client config', 'disconnect', 'permissions', 'tools', 'read', 'edit', 'preset', 'restart'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Approving connections', keywords: ['assistant', 'mcp', 'approve', 'allow all', 'prompt'] },
  { label: 'Remembered programs', keywords: ['assistant', 'forget', 'blocked', 'program'] },
  { label: 'Program permissions', keywords: ['assistant', 'mcp', 'permission', 'tool', 'bundle', 'read', 'edit', 'disabled', 'preset', 'custom'] },
  { label: 'May restart Bxel', keywords: ['assistant', 'mcp', 'restart', 'special', 'developer'] },
  { label: 'Copy client config', keywords: ['assistant', 'mcp', 'config', 'client', 'stdio'] },
];

const AssistantProgramsScreen = () => <AssistantPanel />;

export default AssistantProgramsScreen;
export { meta, searchEntries };
