/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { RULER_TEXT } from '../../ruler/ruler.constants';
import { useCanvasRuler } from './behavior/useCanvasRuler';
import type { CanvasRulerProps } from './CanvasRuler.type';
import { RULER_CLASS } from './CanvasRuler.constants';
import './CanvasRuler.css';

const CanvasRuler = (props: CanvasRulerProps) => {
  const ruler = useCanvasRuler(props);
  return (
    <Box
      ref={ruler.boxRef}
      className={RULER_CLASS[props.axis]}
      role="img"
      aria-label={RULER_TEXT[props.axis]}
      data-grab={ruler.grab ? '' : undefined}
      onPointerDown={ruler.onPointerDown}
      onPointerMove={ruler.onPointerMove}
      onPointerUp={ruler.onPointerUp}
      onPointerCancel={ruler.onPointerUp}
      onDoubleClick={ruler.onDoubleClick}
    >
      <Canvas ref={ruler.canvasRef} className="canvas-ruler__canvas" aria-hidden="true" />
    </Box>
  );
};

export { CanvasRuler };
