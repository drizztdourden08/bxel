/* @layer renderer-app @kind component */
import { useMemo, useRef } from 'react';
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import { useEscapeCancel } from '../../EditorCanvas/behavior/useEscapeCancel';
import { useSyncPending } from '../../EditorCanvas/behavior/useSyncPending';
import { useViewportBridge } from '../../EditorCanvas/behavior/useViewportBridge';
import { PixelViewport } from '../../PixelViewport';
import { FRAMED_VIEWPORT, RulerFrame } from '../../RulerFrame';
import { useGuideRedraw } from '../../EditorCanvas/behavior/useGuideRedraw';
import { useRulerUnits } from '../../EditorCanvas/behavior/useRulerUnits';
import { useViewDefaults } from '../../EditorCanvas/behavior/useViewDefaults';
import type { PixelViewportHandle } from '../../PixelViewport';
import { SHEET_CANVAS_TEXT, SHEET_MENU } from '../SheetCanvas.constants';
import type { SheetDrag, SheetSurfaceProps } from '../SheetCanvas.type';
import { sheetKeyDown } from '../behavior/sheet-key-down';
import { useSheetMenu } from '../behavior/useSheetMenu';
import { useSheetGestures } from '../behavior/useSheetGestures';
import { useSheetPaint } from '../behavior/useSheetPaint';
import { feedView } from '../../../view-feed/feed-view';

const SheetSurface = ({ sheet }: SheetSurfaceProps) => {
  const viewport = useRef<PixelViewportHandle>(null);
  const drag = useRef<SheetDrag | null>(null);
  const look = useAssetLook(useCanvasLook());
  const gridTile = useViewStore((state) => state.gridTile);
  const hand = useToolStore((state) => state.tool === 'hand');
  const { model, data } = sheet;
  const { view } = useAssetView();
  const { labels, overlaps, pivots } = view;
  const marks = useMemo(() => ({ labels, overlaps, pivots }), [labels, overlaps, pivots]);
  const base = useMemo(
    () => ({ model, marks, selected: new Set(data.scene.selected.map((sprite) => sprite.id)), active: data.scene.active?.id ?? null }),
    [model, marks, data.scene.selected, data.scene.active],
  );
  const draw = useSheetPaint(base, drag, viewport);
  const gestures = useSheetGestures(viewport, sheet, drag);
  useSheetMenu(viewport, model.items);
  useViewportBridge(viewport, true);
  useViewDefaults();
  useRulerUnits();
  useGuideRedraw(viewport, null);
  useSyncPending(useEditorTarget());
  useEscapeCancel();
  return (
    <Box className="sheet-canvas" {...contextMenuZone(SHEET_MENU.zone)}>
      <RulerFrame>
        <PixelViewport
          ref={viewport}
          className={`sheet-canvas__viewport ${FRAMED_VIEWPORT}`}
          label={SHEET_CANVAS_TEXT.label}
          width={model.extent.width}
          height={model.extent.height}
          source={sheet.image}
          draw={draw}
          look={look}
          hand={hand}
          onView={feedView}
          grid={false}
          gridTile={gridTile}
          onPointerPixel={(pixel) => useReadoutStore.getState().setPointer(pixel)}
          onPointerDown={gestures.down}
          onPointerMove={gestures.move}
          onPointerUp={gestures.up}
          onKeyDown={sheetKeyDown}
        />
      </RulerFrame>
    </Box>
  );
};

export { SheetSurface };
