/* @layer renderer-app @kind hook */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { foldItems } from '../../../status-extras/fold-items';
import { foldOrder } from '../../../status-extras/fold-order';
import { hasTruncation } from './has-truncation';

const useFoldedItems = (items: readonly StatusBarEntry[], zone: RefObject<HTMLElement | null>): StatusBarEntry[] => {
  const [dropped, setDropped] = useState(0);
  const ids = items.map((item) => item.id).join('|');
  const droppable = foldOrder(items).length;
  useLayoutEffect(() => setDropped(0), [ids]);
  useLayoutEffect(() => {
    const element = zone.current;
    const Observer = element?.ownerDocument.defaultView?.ResizeObserver;
    if (!element || !Observer) return undefined;
    const observer = new Observer(() => setDropped(0));
    observer.observe(element);
    return () => observer.disconnect();
  }, [zone]);
  useLayoutEffect(() => {
    if (dropped < droppable && hasTruncation(zone.current)) setDropped(dropped + 1);
  });
  return foldItems(items, dropped);
};

export { useFoldedItems };
