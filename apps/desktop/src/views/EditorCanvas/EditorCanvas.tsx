/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { useSpriteLook } from '../../canvas-look/useSpriteLook';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePreviewBankImage } from '../../hooks/usePreviewBankImage';
import { useSwatchDraftImage } from '../../hooks/useSwatchDraftImage';
import { usePendingStore } from '../../stores/usePendingStore';
import { useToolStore } from '../../stores/useToolStore';
import { CanvasOverlays } from '../CanvasOverlays';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';
import { canvasClass } from './behavior/canvas-class';
import { canvasSize } from './behavior/canvas-size';
import { canvasSource } from './behavior/canvas-source';
import { paintPivotGrips } from './behavior/paint-pivot-grips';
import { paintReferencesUnder } from './behavior/paint-references-under';
import { useCanvasFlags } from './behavior/useCanvasFlags';
import { useCanvasMenu } from './behavior/useCanvasMenu';
import { useCanvasRedraws } from './behavior/useCanvasRedraws';
import { useCanvasReadout } from './behavior/useCanvasReadout';
import { useCanvasKeys } from './behavior/useCanvasKeys';
import { useSplitTools } from './behavior/useSplitTools';
import { useSplitView } from './behavior/useSplitView';
import { useCommittedImage } from './behavior/useCommittedImage';
import { useEscapeCancel } from './behavior/useEscapeCancel';
import { usePendingImage } from './behavior/usePendingImage';
import { usePlaybackImage } from './behavior/usePlaybackImage';
import { useSyncPending } from './behavior/useSyncPending';
import { useViewSettings } from './behavior/useViewSettings';
import { useViewportBridge } from './behavior/useViewportBridge';
import { viewportProps } from './behavior/viewport-props';
import { CanvasFrame } from './sub-components/CanvasFrame';
import { EmptyCanvas } from './sub-components/EmptyCanvas';
import { RulerBars } from './sub-components/RulerBars';
import { SplitCanvas } from './sub-components/SplitCanvas';
import { paintOverlay } from './behavior/paint-overlay';
import './EditorCanvas.css';
import { feedOtherView } from '../../view-feed/feed-other-view';
import { feedView } from '../../view-feed/feed-view';

const EditorCanvas = () => {
  const target = useEditorTarget();
  const preview = usePlaybackImage();
  const viewport = useRef<PixelViewportHandle>(null);
  const second = useRef<PixelViewportHandle>(null);
  const tool = useToolStore((state) => state.tool);
  const flags = useCanvasFlags();
  const outcome = usePendingStore((state) => state.outcome);
  const look = useSpriteLook(target);
  const committed = useCommittedImage(target, viewport);
  const floating = usePendingImage(outcome);
  const draft = useSwatchDraftImage(target);
  const swapped = usePreviewBankImage(target);
  const recoloured = draft ?? swapped;
  const tools = useSplitTools(viewport);
  const views = useSplitView(viewport, second);
  const readout = useCanvasReadout(viewport);
  const secondReadout = useCanvasReadout(second);
  const keys = useCanvasKeys(viewport);
  useCanvasMenu(viewport);
  useViewSettings();
  useViewportBridge(viewport, target !== null);
  useCanvasRedraws(viewport, second, target);
  useSyncPending(target);
  useEscapeCancel();
  if (!target && !preview) return <EmptyCanvas />;
  const size = canvasSize(preview, outcome, target);
  const shown = canvasSource(preview, floating, tools.live, recoloured, committed);
  const common = viewportProps({ tool, size, source: shown, look, flags, onKeyDown: keys.onKeyDown });
  const primary = (
    <PixelViewport
      ref={viewport}
      {...common}
      {...tools.forView(viewport)}
      {...views.first}
      draw={readout.draw}
      under={paintReferencesUnder}
      pivotGrips={preview ? undefined : paintPivotGrips}
      onView={feedView}
      onPointerPixel={(pixel) => {
        keys.onPointerPixel();
        readout.onPointerPixel(pixel);
      }}
    >
      <CanvasOverlays source={shown} viewport={viewport} />
    </PixelViewport>
  );
  const other = <PixelViewport ref={second} {...common} {...tools.forView(second)} {...views.second} draw={paintOverlay} under={paintReferencesUnder} onView={feedOtherView} onPointerPixel={secondReadout.onPointerPixel} />;
  return (
    <CanvasFrame className={canvasClass(flags.rulers)} spriteId={target?.sprite.id ?? null} onBlur={keys.onBlur} onKeyUp={keys.onKeyUp}>
      {flags.rulers && <RulerBars />}
      {flags.split ? <SplitCanvas first={primary} second={other} /> : primary}
    </CanvasFrame>
  );
};

export { EditorCanvas };
