/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { SurroundEditor } from '../../views/SurroundEditor';

const meta: ScreenMeta = { title: 'Canvas surround', icon: 'pencil', order: 3, keywords: ['pattern', 'background', 'stripes', 'custom', 'preview'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Custom surround pattern', keywords: ['pattern', 'background', 'stripes', 'sixteen', 'preview', 'editor'] },
];

const SurroundScreen = () => <SurroundEditor />;

export default SurroundScreen;
export { meta, searchEntries };
