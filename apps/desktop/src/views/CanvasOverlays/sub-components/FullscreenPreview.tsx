/* @layer renderer-app @kind component */
import { announce } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Canvas } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';
import { CANVAS_OVERLAY_TEXT } from '../CanvasOverlays.constants';
import { drawable } from '../behavior/drawable';
import { useAnyKeyClose } from '../behavior/useAnyKeyClose';
import { useFullscreenFocus } from '../behavior/useFullscreenFocus';
import type { FullscreenPreviewProps } from '../CanvasOverlays.type';

const FullscreenPreview = ({ source }: FullscreenPreviewProps) => {
  const open = useViewStore((state) => state.fullscreen);
  const canvas = useRef<HTMLCanvasElement>(null);
  useAnyKeyClose(open);
  useFullscreenFocus(open);
  useEffect(() => {
    if (!open) return;
    announce(CANVAS_OVERLAY_TEXT.fullscreen);
    return () => announce(CANVAS_OVERLAY_TEXT.fullscreenBack);
  }, [open]);
  useEffect(() => {
    const element = canvas.current;
    if (!open || !element || !source) return;
    const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / source.width, window.innerHeight / source.height)));
    element.width = source.width * scale;
    element.height = source.height * scale;
    const ctx = element.getContext('2d');
    const image = drawable(source, element.ownerDocument.createElement('canvas'));
    if (!ctx || !image) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, element.width, element.height);
  }, [open, source]);
  if (!open) return null;
  return createPortal(
    <Box className="canvas-overlays__fullscreen" role="dialog" aria-modal="true" aria-label={CANVAS_OVERLAY_TEXT.fullscreen} onPointerDown={() => useViewStore.getState().setToggles({ fullscreen: false })}>
      <Canvas ref={canvas} className="canvas-overlays__fullscreen-art" />
    </Box>,
    document.body,
  );
};

export { FullscreenPreview };
