/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { useConfigFlags } from '../asset-config/useConfigFlags';
import { useEditorAnnouncements } from '../hooks/useEditorAnnouncements';
import { useEditorNotices } from '../hooks/useEditorNotices';
import { useOpenedFiles } from '../hooks/useOpenedFiles';
import { useArtworkTitle } from '../hooks/useArtworkTitle';
import { useAssistantHost } from '../hooks/useAssistantHost';
import { useProjectHost } from '../hooks/useProjectHost';
import { useToolHost } from '../hooks/useToolHost';
import { useWidgetRules } from '../ui-context/useWidgetRules';
import { useWorkspaceHost } from '../hooks/useWorkspaceHost';
import { EditorScreen } from '../views/EditorScreen';

const meta: ScreenMeta = { title: 'Editor', icon: 'pencil' };

const EditorBase = () => {
  useWorkspaceHost();
  useConfigFlags();
  useAssistantHost();
  useProjectHost();
  useArtworkTitle();
  useOpenedFiles();
  useEditorNotices();
  useEditorAnnouncements();
  useWidgetRules();
  useToolHost();
  return <EditorScreen />;
};

export default EditorBase;
export { meta };
