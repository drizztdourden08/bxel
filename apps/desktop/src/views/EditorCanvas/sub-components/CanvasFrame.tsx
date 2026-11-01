/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { CANVAS_MENU } from '../EditorCanvas.constants';
import { useCanvasDrop } from '../behavior/useCanvasDrop';
import type { CanvasFrameProps } from './CanvasFrame.type';

const CanvasFrame = ({ className, spriteId, onBlur, onKeyUp, children }: CanvasFrameProps) => {
  const frame = useRef<HTMLElement>(null);
  useCanvasDrop(frame, spriteId);
  return (
    <Box ref={frame} className={className} onBlur={onBlur} onKeyUp={onKeyUp} {...contextMenuZone(CANVAS_MENU.zone)}>
      {children}
    </Box>
  );
};

export { CanvasFrame };
