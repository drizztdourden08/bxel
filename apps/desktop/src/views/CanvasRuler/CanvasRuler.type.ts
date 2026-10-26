/* @layer renderer-app @kind types */
import type { MouseEventHandler, PointerEventHandler, RefObject } from 'react';
import type { RulerSpan } from '../../ruler/ruler.type';
import type { SymmetryAxis } from '../../stores/tool-store.type';

interface CanvasRulerProps {
  axis: SymmetryAxis;
}

interface RulerDragArgs {
  axis: SymmetryAxis;
  span: RulerSpan;
  handle: number | null;
}

interface RulerDrag {
  grab: boolean;
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerMove: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onPointerCancel: PointerEventHandler<HTMLElement>;
  onDoubleClick: MouseEventHandler<HTMLElement>;
}

interface CanvasRulerModel extends RulerDrag {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  boxRef: RefObject<HTMLElement | null>;
}

interface RulerArgs {
  axis: SymmetryAxis;
}

export type { CanvasRulerModel, RulerArgs, CanvasRulerProps, RulerDrag, RulerDragArgs };
