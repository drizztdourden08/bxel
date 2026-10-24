/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { ContextBar } from '../ContextBar';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { RecoveryDialog } from '../RecoveryDialog';
import { ToolRail } from '../ToolRail';
import './EditorScreen.css';

const EditorScreen = () => (
  <Flex direction="column" className="editor-screen">
    <ContextBar />
    <Flex gap="sm" className="editor-screen__body">
      <ToolRail />
      <EditorCanvas />
    </Flex>
    <EditorStatus />
    <RecoveryDialog />
  </Flex>
);

export { EditorScreen };
