/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box, EmptyState } from '@drizztdourden08/tessera';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';
import { EDITOR_CANVAS_TEXT } from './EditorCanvas.constants';
import { useCanvasReadout } from './behavior/useCanvasReadout';
import { useCanvasTools } from './behavior/useCanvasTools';
import { useCommittedImage } from './behavior/useCommittedImage';
import './EditorCanvas.css';

const EditorCanvas = () => {
  const target = useEditorTarget();
  const viewport = useRef<PixelViewportHandle>(null);
  const committed = useCommittedImage(target);
  const tools = useCanvasTools(viewport);
  const readout = useCanvasReadout();
  if (!target) return <EmptyState message={EDITOR_CANVAS_TEXT.empty} />;
  return (
    <Box className="editor-canvas" onContextMenu={tools.onContextMenu}>
      <PixelViewport
        ref={viewport}
        className="editor-canvas__viewport"
        label={EDITOR_CANVAS_TEXT.label}
        width={target.sprite.width}
        height={target.sprite.height}
        source={tools.live ?? committed ?? undefined}
        draw={readout.draw}
        onPointerPixel={readout.onPointerPixel}
        onPointerDown={tools.onPointerDown}
        onPointerMove={tools.onPointerMove}
        onPointerUp={tools.onPointerUp}
      />
    </Box>
  );
};

export { EditorCanvas };
