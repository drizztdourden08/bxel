/* @layer renderer-app @kind component */
import { contextMenuHandler, contextMenuZone, useContextMenu } from '@drizztdourden08/brock-react';
import { Box, StatusBar } from '@drizztdourden08/tessera';
import { statusItems } from '../../editor/status-items';
import { STATUS_TEXT } from '../../editor/status.constants';
import { useActiveAsset } from '../../hooks/useActiveAsset';
import { useActiveDocument } from '../../hooks/useActiveDocument';
import { usePaletteSlots } from '../../hooks/usePaletteSlots';
import { useReadoutStore } from '../../stores/useReadoutStore';
import { useFileStore } from '../../stores/useFileStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useToolStore } from '../../stores/useToolStore';
import { useBxelContext } from '../../ui-context/useBxelContext';
import { ActionHint } from '../ActionHint';
import { canvasHelp } from './behavior/canvas-help';
import { statusMenuEntries } from './behavior/status-menu-entries';
import { STATUS_MENU } from './EditorStatus.constants';
import { ruledEntries } from '../../context-menu/ruled-entries';
import './EditorStatus.css';

const EditorStatus = () => {
  const view = useActiveDocument();
  const slots = usePaletteSlots();
  const pointer = useReadoutStore((state) => state.pointer);
  const zoom = useReadoutStore((state) => state.zoom);
  const foreground = useToolStore((state) => state.foreground);
  const background = useToolStore((state) => state.background);
  const tool = useToolStore((state) => state.tool);
  const mode = useSpriteStore((state) => state.mode);
  const tileMode = useTilemapStore((state) => state.editMode);
  const stamp = useTilemapStore((state) => state.stamp.keys.find((key) => key !== 0) ?? null);
  const context = useBxelContext((current) => current);
  const recovered = useFileStore((state) => (view ? view.state.documentId in state.recovered : false));
  const colours = [slots[foreground] ?? null, slots[background] ?? null] as const;
  const asset = useActiveAsset();
  const clean = asset ? !asset.dirty : true;
  useContextMenu(STATUS_MENU.zone, { label: STATUS_MENU.label, entries: ruledEntries(statusMenuEntries) });
  return (
    <ActionHint hint={canvasHelp(tool, mode, tileMode)} placement="top" className="editor-status">
      <Box className="editor-status__zone" {...contextMenuZone(STATUS_MENU.zone)}>
        <StatusBar
          className="editor-status__bar"
          label={STATUS_TEXT.region}
          items={statusItems({ pointer, zoom, colours, clean, recovered, context, tile: stamp })}
          onItemContextMenu={(item, event) => contextMenuHandler(STATUS_MENU.zone, { item })(event)}
        />
      </Box>
    </ActionHint>
  );
};

export { EditorStatus };
