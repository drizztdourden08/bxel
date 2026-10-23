/* @layer renderer-app @kind hook */
import { MIDDLE_BUTTON } from '../PixelViewport.constants';
import type { PixelViewportProps } from '../PixelViewport.type';
import type { ViewportHandlers, ViewportParts } from './viewport.type';
import { usePanDrag } from './usePanDrag';
import { usePointerPixel } from './usePointerPixel';
import { useViewportKeys } from './useViewportKeys';

const useViewportInput = (parts: ViewportParts, props: PixelViewportProps): ViewportHandlers => {
  const { view, box, image } = parts;
  const keys = useViewportKeys(view, box, props.onKeyDown);
  const drag = usePanDrag(view, keys.spaceHeld);
  const pointer = usePointerPixel(view, box, image, props.onPointerPixel);
  return {
    onKeyDown: keys.onKeyDown,
    onKeyUp: keys.onKeyUp,
    onBlur: keys.onBlur,
    onMouseDown: (event) => {
      if (event.button === MIDDLE_BUTTON) event.preventDefault();
    },
    onPointerDown: (event) => {
      event.currentTarget.focus({ preventScroll: true });
      if (!drag.start(event)) props.onPointerDown?.(event);
    },
    onPointerMove: (event) => {
      pointer.report(event);
      if (!drag.move(event)) props.onPointerMove?.(event);
    },
    onPointerUp: (event) => {
      if (!drag.end(event)) props.onPointerUp?.(event);
    },
    onPointerCancel: (event) => {
      drag.end(event);
    },
    onPointerLeave: (event) => {
      pointer.clear();
      props.onPointerLeave?.(event);
    },
  };
};

export { useViewportInput };
