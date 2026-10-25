/* @layer renderer-app @kind logic */
import { marqueeItemRects } from '@drizztdourden08/tessera';
import type { MarqueeItem } from '@drizztdourden08/tessera';
import { MARQUEE_ITEM } from '../SpritesPanel.constants';

const rememberRects = (area: HTMLElement | null, seen: Map<string, MarqueeItem>): readonly MarqueeItem[] => {
  if (area) for (const item of marqueeItemRects(area, MARQUEE_ITEM)) seen.set(item.key, item);
  return [...seen.values()];
};

export { rememberRects };
