/* @layer renderer-app @kind component */
import { commandZone, ToolbarHost } from '@drizztdourden08/brock-react';
import { Flex } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback';
import { useFileTypePanelStore } from '../../stores/useFileTypePanelStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { ApplyBar } from '../ApplyBar';
import { AssetTabs } from '../AssetTabs';
import { DialogHost } from '../DialogHost';
import { EditorStatus } from '../EditorStatus';
import { ExportDialog } from '../ExportDialog';
import { LegacyBar } from '../LegacyBar';
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
  const mode = useSpriteStore((state) => state.mode);
  const placing = useMapPlacing();
  const adding = useFileTypePanelStore((state) => state.open);
  const editing = mode === 'tilemap' && !placing && !adding;
  useTimelinePlayback();
  useTilesetMenu();
  return (
    <Flex as="main" direction="column" className="editor-screen" aria-label={EDITOR_SCREEN_LABEL}>
      <AssetTabs />
      <WorkspaceProgress />
      <LegacyBar />
      <PresetMoveBar />
      <Flex className="editor-screen__body" {...commandZone(COMMAND_ZONE.canvas)}>
        <ToolbarHost>
          <Flex className={editing ? 'editor-screen__stage editor-screen__stage--tile-edit' : 'editor-screen__stage'}>
            <StageBody adding={adding} mode={mode} placing={placing} />
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
