/* @layer renderer-app @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { NAVIGATOR_BOX } from '../Navigator.constants';
import type { ThumbBox } from '../Navigator.type';

const useStageSize = (stage: RefObject<HTMLElement | null>): ThumbBox => {
  const [box, setBox] = useState<ThumbBox>({ width: 0, height: NAVIGATOR_BOX.height });
  useLayoutEffect(() => {
    const element = stage.current;
    const Observer = element?.ownerDocument.defaultView?.ResizeObserver;
    if (!element || !Observer) return undefined;
    const measure = () => setBox((before) => (before.width === element.clientWidth ? before : { ...before, width: element.clientWidth }));
    measure();
    const observer = new Observer(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);
  return box;
};

export { useStageSize };
