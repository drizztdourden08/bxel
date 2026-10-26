/* @layer renderer-app @kind component */
import { contextMenuZone, openContextMenu } from '@drizztdourden08/brock-react';
import { Box, Canvas } from '@drizztdourden08/tessera';
import { RULER_TEXT } from '../../ruler/ruler.constants';
import { useCanvasRuler } from './behavior/useCanvasRuler';
import type { CanvasRulerProps } from './CanvasRuler.type';
import { RULER_CLASS, RULER_MENU } from './CanvasRuler.constants';
import './CanvasRuler.css';

const CanvasRuler = (props: CanvasRulerProps) => {
  const ruler = useCanvasRuler(props);
  return (
    <Box
      ref={ruler.boxRef}
      className={RULER_CLASS[props.axis]}
      role="button"
      aria-label={RULER_TEXT[props.axis]}
      {...contextMenuZone(RULER_MENU.zone(props.axis), { data: { axis: props.axis }, focusable: true })}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openContextMenu(RULER_MENU.zone(props.axis), { axis: props.axis }, { trigger: 'keyboard' });
      }}
      data-grab={ruler.grab ? '' : undefined}
      onPointerDown={ruler.onPointerDown}
      onPointerMove={ruler.onPointerMove}
      onPointerUp={ruler.onPointerUp}
      onPointerCancel={ruler.onPointerCancel}
      onDoubleClick={ruler.onDoubleClick}
    >
      <Canvas ref={ruler.canvasRef} className="canvas-ruler__canvas" aria-hidden="true" />
    </Box>
  );
};

export { CanvasRuler };
