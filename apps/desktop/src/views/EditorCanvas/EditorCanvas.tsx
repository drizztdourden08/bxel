/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useSpriteLook } from '../../canvas-look/useSpriteLook';
import { WRAP_OF } from '../../editor/wrap.constants';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { useSwatchDraftImage } from '../../hooks/useSwatchDraftImage';
import { usePendingStore } from '../../stores/usePendingStore';
import { useToolStore } from '../../stores/useToolStore';
import { stepFrame } from '../../timeline/step-frame';
import { CanvasOverlays } from '../CanvasOverlays';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';
import { CANVAS_MENU, EDITOR_CANVAS_TEXT } from './EditorCanvas.constants';
import { canvasClass } from './behavior/canvas-class';
import { useAreaRedraw } from './behavior/useAreaRedraw';
import { canvasSize } from './behavior/canvas-size';
import { canvasSource } from './behavior/canvas-source';
import { paintPivotGrips } from './behavior/paint-pivot-grips';
import { useCanvasFlags } from './behavior/useCanvasFlags';
import { useCanvasMenu } from './behavior/useCanvasMenu';
import { useCanvasReadout } from './behavior/useCanvasReadout';
import { useCanvasKeys } from './behavior/useCanvasKeys';
import { useCanvasTools } from './behavior/useCanvasTools';
import { useCommittedImage } from './behavior/useCommittedImage';
import { useGuideRedraw } from './behavior/useGuideRedraw';
import { useEscapeCancel } from './behavior/useEscapeCancel';
import { useMarchingAnts } from './behavior/useMarchingAnts';
import { usePendingImage } from './behavior/usePendingImage';
import { usePlaybackImage } from './behavior/usePlaybackImage';
import { useSyncPending } from './behavior/useSyncPending';
import { useViewSettings } from './behavior/useViewSettings';
import { useViewportBridge } from './behavior/useViewportBridge';
import { viewportClass } from './behavior/viewport-class';
import { EmptyCanvas } from './sub-components/EmptyCanvas';
import { RulerBars } from './sub-components/RulerBars';
import './EditorCanvas.css';
import { feedView } from '../../view-feed/feed-view';

const EditorCanvas = () => {
  const target = useEditorTarget();
  const preview = usePlaybackImage();
  const viewport = useRef<PixelViewportHandle>(null);
  const tool = useToolStore((state) => state.tool);
  const flags = useCanvasFlags();
  const outcome = usePendingStore((state) => state.outcome);
  const look = useSpriteLook(target);
  const committed = useCommittedImage(target, viewport);
  const floating = usePendingImage(outcome);
  const recoloured = useSwatchDraftImage(target);
  const tools = useCanvasTools(viewport);
  const readout = useCanvasReadout(viewport);
  const keys = useCanvasKeys(viewport);
  useCanvasMenu(viewport);
  useViewSettings();
  useViewportBridge(viewport, target !== null);
  useMarchingAnts(viewport);
  useAreaRedraw(viewport);
  useGuideRedraw(viewport, target);
  useSyncPending(target);
  useEscapeCancel();
  if (!target && !preview) return <EmptyCanvas />;
  const size = canvasSize(preview, outcome, target);
  const shown = canvasSource(preview, floating, tools.live, recoloured, committed);
  return (
    <Box className={canvasClass(flags.rulers)} onBlur={keys.onBlur} {...contextMenuZone(CANVAS_MENU.zone)}>
      {flags.rulers && <RulerBars />}
      <PixelViewport
        ref={viewport}
        className={viewportClass(tool)}
        label={EDITOR_CANVAS_TEXT.label}
        hint={EDITOR_CANVAS_TEXT.hint}
        width={size.width}
        height={size.height}
        source={shown}
        draw={readout.draw}
        pivotGrips={preview ? undefined : paintPivotGrips}
        look={look}
        grid={flags.grid}
        gridMajor={flags.gridMajor}
        gridTile={flags.gridTile}
        gridIso={flags.gridIso}
        mirror={flags.mirror}
        onAltWheel={stepFrame}
        hand={tool === 'hand'}
        onView={feedView}
        tiled={WRAP_OF[flags.tiled]}
        onPointerPixel={(pixel) => {
          keys.onPointerPixel();
          readout.onPointerPixel(pixel);
        }}
        onPointerDown={tools.onPointerDown}
        onPointerMove={tools.onPointerMove}
        onPointerUp={tools.onPointerUp}
        onKeyDown={keys.onKeyDown}
      >
        <CanvasOverlays source={shown} viewport={viewport} />
      </PixelViewport>
    </Box>
  );
};

export { EditorCanvas };
