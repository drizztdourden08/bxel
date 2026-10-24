/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { ApplyBar } from '../ApplyBar';
import { ContextBar } from '../ContextBar';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { ExportDialog } from '../ExportDialog';
import { RecoveryDialog } from '../RecoveryDialog';
import { ToolRail } from '../ToolRail';
import { TransformDialog } from '../TransformDialog';
import './EditorScreen.css';

const EditorScreen = () => (
  <Flex direction="column" className="editor-screen">
    <ContextBar />
    <Flex gap="sm" className="editor-screen__body">
      <ToolRail />
      <EditorCanvas />
    </Flex>
    <ApplyBar />
    <EditorStatus />
    <RecoveryDialog />
    <ExportDialog />
    <TransformDialog />
  </Flex>
);

export { EditorScreen };
