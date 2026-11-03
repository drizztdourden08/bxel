/* @layer renderer-app @kind logic */
import type { MarqueeItem, VirtualListHandle } from '@drizztdourden08/tessera';

const trackRects = (list: VirtualListHandle | null, root: HTMLElement | null, scroller: HTMLElement | null): readonly MarqueeItem[] => {
  if (!list || !root || !scroller) return [];
  const at = root.getBoundingClientRect();
  const frame = scroller.getBoundingClientRect();
  const dx = at.left - frame.left - scroller.clientLeft + scroller.scrollLeft;
  const dy = at.top - frame.top - scroller.clientTop + scroller.scrollTop;
  return list.getRects().map((item) => ({ ...item, rect: { ...item.rect, x: item.rect.x + dx, y: item.rect.y + dy } }));
};

export { trackRects };
