/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box, EmptyState } from '@drizztdourden08/tessera';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePendingStore } from '../../stores/usePendingStore';
import { useToolStore } from '../../stores/useToolStore';
import { useViewStore } from '../../stores/useViewStore';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';
import { EDITOR_CANVAS_TEXT, TILING_OF } from './EditorCanvas.constants';
import { canvasKeyDown } from './behavior/canvas-key-down';
import { useCanvasReadout } from './behavior/useCanvasReadout';
import { useCanvasTools } from './behavior/useCanvasTools';
import { useCommittedImage } from './behavior/useCommittedImage';
import { useEscapeCancel } from './behavior/useEscapeCancel';
import { useMarchingAnts } from './behavior/useMarchingAnts';
import { usePendingImage } from './behavior/usePendingImage';
import { useSyncPending } from './behavior/useSyncPending';
import { useViewportBridge } from './behavior/useViewportBridge';
import './EditorCanvas.css';

const EditorCanvas = () => {
  const target = useEditorTarget();
  const viewport = useRef<PixelViewportHandle>(null);
  const tool = useToolStore((state) => state.tool);
  const grid = useViewStore((state) => state.grid);
  const tiled = useViewStore((state) => state.tiled);
  const outcome = usePendingStore((state) => state.outcome);
  const committed = useCommittedImage(target);
  const floating = usePendingImage(outcome);
  const tools = useCanvasTools(viewport);
  const readout = useCanvasReadout(viewport);
  useViewportBridge(viewport, target !== null);
  useMarchingAnts(viewport);
  useSyncPending(target);
  useEscapeCancel();
  if (!target) return <EmptyState message={EDITOR_CANVAS_TEXT.empty} />;
  return (
    <Box className="editor-canvas" onContextMenu={tools.onContextMenu}>
      <PixelViewport
        ref={viewport}
        className={tool === 'zoom' ? 'editor-canvas__viewport editor-canvas__viewport--zoom' : 'editor-canvas__viewport'}
        label={EDITOR_CANVAS_TEXT.label}
        width={outcome?.width ?? target.sprite.width}
        height={outcome?.height ?? target.sprite.height}
        source={floating ?? tools.live ?? committed ?? undefined}
        draw={readout.draw}
        grid={grid}
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
