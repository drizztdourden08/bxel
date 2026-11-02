/* @layer renderer-app @kind component */
import { KeymapPage } from '@drizztdourden08/brock-react';
import type { ScreenMeta } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Keyboard', showHeader: true, icon: 'keyboard', order: 8, keywords: ['shortcuts', 'keys', 'keymap', 'chord', 'remap', 'hold'] };

const KeyboardScreen = () => <KeymapPage />;

export default KeyboardScreen;
export { meta };
