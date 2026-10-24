/* @layer renderer-app @kind hook */
import { scrollTopToShow } from '@drizztdourden08/tessera';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { SpriteId } from '@bxel/document';
import type { GridRow } from '../../../sheet-manager/folders.type';

const useScrollToActive = (area: RefObject<HTMLElement | null>, rows: readonly GridRow[], activeId: SpriteId | null, rowHeight: number): void => {
  useEffect(() => {
    const root = area.current;
    const index = rows.findIndex((row) => row.facts.some((fact) => fact.sprite.id === activeId));
    if (!root || index < 0 || rowHeight <= 0) return;
    root.scrollTop = scrollTopToShow({ index, rowHeight, viewport: root.clientHeight, scrollTop: root.scrollTop });
  }, [area, rows, activeId, rowHeight]);
};

export { useScrollToActive };
