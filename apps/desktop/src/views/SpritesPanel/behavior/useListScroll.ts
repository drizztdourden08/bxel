/* @layer renderer-app @kind hook */
import type { DataTableHandle } from '@drizztdourden08/tessera';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { LIST_HEAD_ROOM } from '../SpritesPanel.constants';

const useListScroll = (table: RefObject<DataTableHandle | null>, area: RefObject<HTMLElement | null>, activeId: string | null): void => {
  useEffect(() => {
    const scroller = area.current;
    const item = activeId === null ? undefined : table.current?.getRects().find((each) => each.key === activeId);
    if (!scroller || !item) return;
    const { y, height } = item.rect;
    if (y >= scroller.scrollTop + LIST_HEAD_ROOM && y + height <= scroller.scrollTop + scroller.clientHeight) return;
    scroller.scrollTo({ top: Math.max(0, y - scroller.clientHeight / 2) });
  }, [table, area, activeId]);
};

export { useListScroll };
