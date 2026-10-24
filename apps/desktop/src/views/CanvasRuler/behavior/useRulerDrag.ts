/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
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
  const [grab, setGrab] = useState(false);
  const onHandle = (at: number): boolean => handle !== null && nearHandle(at, handlePosition(handle, span));
  return {
    grab,
    onPointerDown: (event) => {
      if (!onHandle(alongOf(event, axis === 'x'))) return;
      held.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setGrab(true);
    },
    onPointerMove: (event) => {
      const at = alongOf(event, axis === 'x');
      if (held.current) useToolStore.getState().setAxis(axis, axisFromRuler(at, span, event.shiftKey));
      else setGrab(onHandle(at));
    },
    onPointerUp: () => {
      held.current = false;
    },
    onDoubleClick: (event) => {
      if (onHandle(alongOf(event, axis === 'x'))) useToolStore.getState().setAxis(axis, null);
    },
  };
};

export { useRulerDrag };
