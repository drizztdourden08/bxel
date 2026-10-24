/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box, EmptyState } from '@drizztdourden08/tessera';
import { useCanvasLook } from '../../canvas-look/useCanvasLook';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePendingStore } from '../../stores/usePendingStore';
import { useToolStore } from '../../stores/useToolStore';
import { useViewStore } from '../../stores/useViewStore';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';
import { EDITOR_CANVAS_TEXT, TILING_OF } from './EditorCanvas.constants';
import { canvasClass } from './behavior/canvas-class';
import { canvasKeyDown } from './behavior/canvas-key-down';
import { useCanvasReadout } from './behavior/useCanvasReadout';
import { useCanvasTools } from './behavior/useCanvasTools';
import { useCommittedImage } from './behavior/useCommittedImage';
import { useEscapeCancel } from './behavior/useEscapeCancel';
import { useMarchingAnts } from './behavior/useMarchingAnts';
import { usePendingImage } from './behavior/usePendingImage';
import { useSyncPending } from './behavior/useSyncPending';
import { useViewDefaults } from './behavior/useViewDefaults';
import { useViewportBridge } from './behavior/useViewportBridge';
import { viewportClass } from './behavior/viewport-class';
import { RulerBars } from './sub-components/RulerBars';
import './EditorCanvas.css';

const EditorCanvas = () => {
  const target = useEditorTarget();
  const viewport = useRef<PixelViewportHandle>(null);
  const tool = useToolStore((state) => state.tool);
  const grid = useViewStore((state) => state.grid);
  const gridMajor = useViewStore((state) => state.gridMajor);
  const gridTile = useViewStore((state) => state.gridTile);
  const rulers = useViewStore((state) => state.rulers);
  const tiled = useViewStore((state) => state.tiled);
  const outcome = usePendingStore((state) => state.outcome);
  const look = useCanvasLook();
  const committed = useCommittedImage(target);
  const floating = usePendingImage(outcome);
  const tools = useCanvasTools(viewport);
  const readout = useCanvasReadout(viewport);
  useViewDefaults();
  useViewportBridge(viewport, target !== null);
  useMarchingAnts(viewport);
  useSyncPending(target);
  useEscapeCancel();
  if (!target) return <EmptyState message={EDITOR_CANVAS_TEXT.empty} />;
  return (
    <Box className={canvasClass(rulers)} onContextMenu={tools.onContextMenu}>
      {rulers && <RulerBars />}
      <PixelViewport
        ref={viewport}
        className={viewportClass(tool)}
        label={EDITOR_CANVAS_TEXT.label}
        width={outcome?.width ?? target.sprite.width}
        height={outcome?.height ?? target.sprite.height}
        source={floating ?? tools.live ?? committed ?? undefined}
        draw={readout.draw}
        look={look}
        grid={grid}
        gridMajor={gridMajor}
        gridTile={gridTile}
        hand={tool === 'hand'}
        tiled={TILING_OF[tiled]}
        onPointerPixel={readout.onPointerPixel}
        onPointerDown={tools.onPointerDown}
        onPointerMove={tools.onPointerMove}
        onPointerUp={tools.onPointerUp}
        onKeyDown={canvasKeyDown}
      />
    </Box>
  );
};

export { EditorCanvas };
