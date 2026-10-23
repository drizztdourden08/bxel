/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { RecoveryDialog } from '../RecoveryDialog';
import { ToolRail } from '../ToolRail';
import { useEditorKeys } from './behavior/useEditorKeys';
import './EditorScreen.css';

const EditorScreen = () => {
  const onKeyDown = useEditorKeys();
  return (
    <Flex direction="column" className="editor-screen" onKeyDown={onKeyDown}>
      <Flex gap="sm" className="editor-screen__body">
        <ToolRail />
        <EditorCanvas />
      </Flex>
      <EditorStatus />
      <RecoveryDialog />
    </Flex>
  );
};

export { EditorScreen };
