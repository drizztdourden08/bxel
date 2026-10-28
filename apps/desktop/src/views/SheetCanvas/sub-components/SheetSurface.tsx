/* @layer renderer-app @kind component */
import { useMemo, useRef } from 'react';
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useEscapeCancel } from '../../EditorCanvas/behavior/useEscapeCancel';
import { useSyncPending } from '../../EditorCanvas/behavior/useSyncPending';
import { useViewportBridge } from '../../EditorCanvas/behavior/useViewportBridge';
import { PixelViewport } from '../../PixelViewport';
import type { PixelViewportHandle } from '../../PixelViewport';
import { SHEET_CANVAS_TEXT, SHEET_MENU } from '../SheetCanvas.constants';
import type { SheetDrag, SheetSurfaceProps } from '../SheetCanvas.type';
import { sheetKeyDown } from '../behavior/sheet-key-down';
import { useSheetDrop } from '../behavior/useSheetDrop';
import { useSheetMenu } from '../behavior/useSheetMenu';
import { useSheetGestures } from '../behavior/useSheetGestures';
import { useSheetPaint } from '../behavior/useSheetPaint';
import { SheetExportBar } from './SheetExportBar';

const SheetSurface = ({ sheet }: SheetSurfaceProps) => {
  const viewport = useRef<PixelViewportHandle>(null);
  const drag = useRef<SheetDrag | null>(null);
  const hand = useToolStore((state) => state.tool === 'hand');
  const { model, data, exported } = sheet;
  const base = useMemo(
    () => ({ model, selected: new Set(data.scene.selected.map((sprite) => sprite.id)), active: data.scene.active?.id ?? null }),
    [model, data.scene.selected, data.scene.active],
  );
  const draw = useSheetPaint(base, drag, viewport);
  const gestures = useSheetGestures(viewport, sheet, drag);
  const dropping = useSheetDrop(viewport, model.sheet?.id ?? null, exported !== null);
  useSheetMenu(viewport, model.items);
  useViewportBridge(viewport, true);
  useSyncPending(useEditorTarget());
  useEscapeCancel();
  const reading = exported !== null;
  return (
    <Box className="sheet-canvas" {...contextMenuZone(SHEET_MENU.zone)} {...dropping}>
      <PixelViewport
        ref={viewport}
        className="sheet-canvas__viewport"
        label={reading ? SHEET_CANVAS_TEXT.exportLabel : SHEET_CANVAS_TEXT.label}
        width={exported?.width ?? model.extent.width}
        height={exported?.height ?? model.extent.height}
        source={sheet.image}
        draw={reading ? undefined : draw}
        hand={hand}
        grid={false}
        onPointerPixel={(pixel) => useReadoutStore.getState().setPointer(pixel)}
        onPointerDown={reading ? undefined : gestures.down}
        onPointerMove={reading ? undefined : gestures.move}
        onPointerUp={reading ? undefined : gestures.up}
        onKeyDown={reading ? undefined : sheetKeyDown}
      />
      <SheetExportBar sheet={sheet} />
    </Box>
  );
};

export { SheetSurface };
