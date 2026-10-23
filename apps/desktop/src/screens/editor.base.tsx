/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { EditorScreen } from '../views/EditorScreen';

const meta: ScreenMeta = { title: 'Editor', icon: 'pencil' };

const EditorBase = () => <EditorScreen />;

export default EditorBase;
export { meta };
