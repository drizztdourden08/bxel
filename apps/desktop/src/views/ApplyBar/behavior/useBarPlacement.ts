/* @layer renderer-app @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import type { PixelRect } from '../../PixelViewport';
import type { BarPlacement } from '../ApplyBar.type';
import { anchorRect } from './anchor-rect';
import { placeBar } from './place-bar';

const same = (a: BarPlacement | null, b: BarPlacement): boolean => a !== null && a.x === b.x && a.y === b.y && a.docked === b.docked;

const useBarPlacement = (bar: RefObject<HTMLElement | null>, anchor: PixelRect | null, shown: boolean): BarPlacement | null => {
  const [placement, setPlacement] = useState<BarPlacement | null>(null);
  useLayoutEffect(() => {
    const element = bar.current;
    const parent = element?.offsetParent;
    if (!shown || !element || !parent) {
      setPlacement(null);
      return undefined;
    }
    const measure = () => {
      const box = parent.getBoundingClientRect();
      const next = placeBar(anchorRect(anchor), { left: box.left, top: box.top, right: box.right, bottom: box.bottom }, { width: element.offsetWidth, height: element.offsetHeight });
      setPlacement((before) => (same(before, next) ? before : next));
    };
    measure();
    const Observer = element.ownerDocument.defaultView?.ResizeObserver;
    const observer = Observer ? new Observer(measure) : null;
    observer?.observe(parent);
    const stop = useViewFeedStore.subscribe(measure);
    return () => {
      stop();
      observer?.disconnect();
    };
  }, [bar, anchor, shown]);
  return placement;
};

export { useBarPlacement };
