/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { beginGuide } from '../../../guides/begin-guide';
import { cancelGuide } from '../../../guides/cancel-guide';
import { dragGuide } from '../../../guides/drag-guide';
import { dropGuide } from '../../../guides/drop-guide';
import { axisFromRuler } from '../../../ruler/axis-from-ruler';
import { handlePosition } from '../../../ruler/handle-position';
import { nearHandle } from '../../../ruler/near-handle';
import { useToolStore } from '../../../stores/useToolStore';
import type { RulerDrag, RulerDragArgs } from '../CanvasRuler.type';

const alongOf = (event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>, horizontal: boolean): number => {
  const box = event.currentTarget.getBoundingClientRect();
  return horizontal ? event.clientX - box.left : event.clientY - box.top;
};

const useRulerDrag = ({ axis, span, handle }: RulerDragArgs): RulerDrag => {
  const held = useRef(false);
  const pulling = useRef(false);
  const [grab, setGrab] = useState(false);
  const onHandle = (at: number): boolean => handle !== null && nearHandle(at, handlePosition(handle, span));
  return {
    grab,
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      if (!onHandle(alongOf(event, axis === 'x'))) {
        pulling.current = beginGuide(axis === 'x' ? 'y' : 'x', null);
        if (pulling.current) event.currentTarget.setPointerCapture(event.pointerId);
        return;
      }
      held.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setGrab(true);
    },
    onPointerMove: (event) => {
      if (pulling.current) {
        dragGuide(event, event.shiftKey);
        return;
      }
      const at = alongOf(event, axis === 'x');
      if (held.current) useToolStore.getState().setAxis(axis, axisFromRuler(at, span, event.shiftKey));
      else setGrab(onHandle(at));
    },
    onPointerUp: () => {
      held.current = false;
      if (!pulling.current) return;
      pulling.current = false;
      dropGuide();
    },
    onPointerCancel: () => {
      held.current = false;
      if (!pulling.current) return;
      pulling.current = false;
      cancelGuide();
    },
    onDoubleClick: (event) => {
      if (onHandle(alongOf(event, axis === 'x'))) useToolStore.getState().setAxis(axis, null);
    },
  };
};

export { useRulerDrag };
