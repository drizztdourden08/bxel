/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { ApplyBar } from '../ApplyBar';
import { ContextBar } from '../ContextBar';
import { DialogHost } from '../DialogHost';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { ExportDialog } from '../ExportDialog';
import { MismatchBar } from '../MismatchBar';
import { RecoveryDialog } from '../RecoveryDialog';
import { SheetCanvas } from '../SheetCanvas';
import { ToolRail } from '../ToolRail';
import { TransformDialog } from '../TransformDialog';
import './EditorScreen.css';

const EditorScreen = () => {
  const mode = useSpriteStore((state) => state.mode);
  return (
    <Flex direction="column" className="editor-screen">
      <ContextBar />
      <Flex gap="sm" className="editor-screen__body">
        <ToolRail />
        <Flex className="editor-screen__stage">
          {mode === 'sheet' ? <SheetCanvas /> : <EditorCanvas />}
          <ApplyBar />
        </Flex>
      </Flex>
      <MismatchBar />
      <EditorStatus />
      <RecoveryDialog />
      <ExportDialog />
      <TransformDialog />
      <DialogHost />
    </Flex>
  );
};

export { EditorScreen };
