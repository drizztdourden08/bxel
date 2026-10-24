/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { ApplyBar } from '../ApplyBar';
import { DialogHost } from '../DialogHost';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { ExportDialog } from '../ExportDialog';
import { MismatchBar } from '../MismatchBar';
import { RecoveryDialog } from '../RecoveryDialog';
import { ScopeBar } from '../ScopeBar';
import { SheetCanvas } from '../SheetCanvas';
import { TilemapCanvas } from '../TilemapCanvas';
import { TilemapDialog } from '../TilemapDialog';
import { TransformDialog } from '../TransformDialog';
import './EditorScreen.css';

const EditorScreen = () => {
  const mode = useSpriteStore((state) => state.mode);
  const placing = useMapPlacing();
  const editing = mode === 'tilemap' && !placing;
  useTimelinePlayback();
  return (
    <Flex direction="column" className="editor-screen">
      <Flex className="editor-screen__body">
        <Flex className={editing ? 'editor-screen__stage editor-screen__stage--tile-edit' : 'editor-screen__stage'}>
          {mode === 'sheet' && <SheetCanvas />}
          {placing && <TilemapCanvas />}
          {mode !== 'sheet' && !placing && <EditorCanvas />}
          <ApplyBar />
        </Flex>
      </Flex>
      <MismatchBar />
      <ScopeBar />
      <EditorStatus />
      <RecoveryDialog />
      <ExportDialog />
      <TransformDialog />
      <TilemapDialog />
      <DialogHost />
    </Flex>
  );
};

export { EditorScreen };
