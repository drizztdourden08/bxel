/* @layer renderer-app @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { EMPTY_BOX } from '../PixelViewport.constants';
import type { ViewBox } from './viewport.type';
import { measureBox } from './measure-box';
import { sameBox } from './same-box';
import { watchSize } from './watch-size';
import { windowOf } from './window-of';

const watchRatio = (root: HTMLElement, onChange: () => void): (() => void) => {
  const view = windowOf(root);
  let query = view.matchMedia(`(resolution: ${view.devicePixelRatio}dppx)`);
  const changed = () => {
    query.removeEventListener('change', changed);
    query = view.matchMedia(`(resolution: ${view.devicePixelRatio}dppx)`);
    query.addEventListener('change', changed);
    onChange();
  };
  query.addEventListener('change', changed);
  return () => query.removeEventListener('change', changed);
};

const useBoxSize = (rootRef: RefObject<HTMLElement | null>): ViewBox => {
  const [box, setBox] = useState<ViewBox>(EMPTY_BOX);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => {
      const next = measureBox(root);
      setBox((before) => (sameBox(before, next) ? before : next));
    };
    measure();
    const stopResize = watchSize(root, measure);
    const stopRatio = watchRatio(root, measure);
    return () => {
      stopResize();
      stopRatio();
    };
  }, [rootRef]);
  return box;
};

export { useBoxSize };
