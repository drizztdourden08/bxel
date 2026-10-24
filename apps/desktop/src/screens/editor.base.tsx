/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { useEditorNotices } from '../hooks/useEditorNotices';
import { useOpenedFiles } from '../hooks/useOpenedFiles';
import { useArtworkTitle } from '../hooks/useArtworkTitle';
import { useAssistantHost } from '../hooks/useAssistantHost';
import { EditorScreen } from '../views/EditorScreen';

const meta: ScreenMeta = { title: 'Editor', icon: 'pencil' };

const EditorBase = () => {
  useAssistantHost();
  useArtworkTitle();
  useOpenedFiles();
  useEditorNotices();
  return <EditorScreen />;
};

export default EditorBase;
export { meta };
