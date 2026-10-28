/* @layer renderer-app @kind component */
import { commandZone, ToolbarHost } from '@drizztdourden08/brock-react';
import { Flex } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback';
import { useFileTypePanelStore } from '../../stores/useFileTypePanelStore';
import { useBxelContext } from '../../ui-context/useBxelContext';
import { ApplyBar } from '../ApplyBar';
import { AssetTabs } from '../AssetTabs';
import { DialogHost } from '../DialogHost';
import { EditorStatus } from '../EditorStatus';
import { FrameBar } from '../FrameBar';
import { ExportDialog } from '../ExportDialog';
import { LegacyBar } from '../LegacyBar';
import { MigrationBar } from '../MigrationBar';
import { MismatchBar } from '../MismatchBar';
import { PresetMoveBar } from '../PresetMoveBar';
import { RecoveryDialog } from '../RecoveryDialog';
import { ScopeBar } from '../ScopeBar';
import { SplitDialog } from '../SplitDialog';
import { TilemapDialog } from '../TilemapDialog';
import { useTilesetMenu } from '../TilesetPanel';
import { TransformDialog } from '../TransformDialog';
import { WorkspaceProgress } from '../WorkspaceProgress';
import { EDITOR_SCREEN_LABEL } from './EditorScreen.constants';
import { StageBody } from './sub-components/StageBody';
import './EditorScreen.css';

const EditorScreen = () => {
  const adding = useFileTypePanelStore((state) => state.open);
  const editing = useBxelContext((context) => context.fileType === 'tilemap' && context.tileMode === 'edit') && !adding;
  useTimelinePlayback();
  useTilesetMenu();
  return (
    <Flex as="main" direction="column" className="editor-screen" aria-label={EDITOR_SCREEN_LABEL}>
      <AssetTabs />
      <WorkspaceProgress />
      <LegacyBar />
      <MigrationBar />
      <FrameBar />
      <PresetMoveBar />
      <Flex className="editor-screen__body" {...commandZone(COMMAND_ZONE.canvas)}>
        <ToolbarHost>
          <Flex className={editing ? 'editor-screen__stage editor-screen__stage--tile-edit' : 'editor-screen__stage'}>
            <StageBody adding={adding} />
            <ApplyBar />
          </Flex>
        </ToolbarHost>
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
    </Flex>
  );
};

export { EditorScreen };
