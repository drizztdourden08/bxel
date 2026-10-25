/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Flex } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { ApplyBar } from '../ApplyBar';
import { Announcer } from '../Announcer';
import { AssetTabs } from '../AssetTabs';
import { DialogHost } from '../DialogHost';
import { EditorCanvas } from '../EditorCanvas';
import { EditorStatus } from '../EditorStatus';
import { ExportDialog } from '../ExportDialog';
import { LegacyBar } from '../LegacyBar';
import { MismatchBar } from '../MismatchBar';
import { PresetMoveBar } from '../PresetMoveBar';
import { RecoveryDialog } from '../RecoveryDialog';
import { ScopeBar } from '../ScopeBar';
import { SheetCanvas } from '../SheetCanvas';
import { SplitDialog } from '../SplitDialog';
import { TilemapCanvas } from '../TilemapCanvas';
import { TilemapDialog } from '../TilemapDialog';
import { TransformDialog } from '../TransformDialog';
import { WorkspaceProgress } from '../WorkspaceProgress';
import { EDITOR_SCREEN_LABEL } from './EditorScreen.constants';
import './EditorScreen.css';

const EditorScreen = () => {
  const mode = useSpriteStore((state) => state.mode);
  const placing = useMapPlacing();
  const editing = mode === 'tilemap' && !placing;
  useTimelinePlayback();
  return (
    <Flex as="main" direction="column" className="editor-screen" aria-label={EDITOR_SCREEN_LABEL}>
      <AssetTabs />
      <WorkspaceProgress />
      <LegacyBar />
      <PresetMoveBar />
      <Flex className="editor-screen__body" {...commandZone(COMMAND_ZONE.canvas)}>
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
      <SplitDialog />
      <DialogHost />
      <Announcer />
    </Flex>
  );
};

export { EditorScreen };
