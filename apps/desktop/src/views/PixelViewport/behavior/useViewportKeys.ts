/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { FocusEvent, KeyboardEvent, KeyboardEventHandler, RefObject } from 'react';
import { SPACE_KEY } from '../PixelViewport.constants';
import type { ViewBox, ViewportKeys, ViewState } from './viewport.type';
import { viewportKey } from './viewport-key';

const release = (target: HTMLElement, held: RefObject<boolean>): void => {
  held.current = false;
  delete target.dataset.grab;
};

const useViewportKeys = (view: ViewState, box: ViewBox, appKeyDown?: KeyboardEventHandler<HTMLElement>): ViewportKeys => {
  const spaceHeld = useRef(false);
  return {
    spaceHeld,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      appKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === SPACE_KEY) {
        event.preventDefault();
        spaceHeld.current = true;
        event.currentTarget.dataset.grab = '';
        return;
      }
      const action = viewportKey(event, view, box);
      if (!action) return;
      event.preventDefault();
      action();
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === SPACE_KEY) release(event.currentTarget, spaceHeld);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => release(event.currentTarget, spaceHeld),
  };
};

export { useViewportKeys };
