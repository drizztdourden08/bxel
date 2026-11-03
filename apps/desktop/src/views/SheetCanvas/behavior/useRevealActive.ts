/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { SheetItem } from '../../../sheet/sheet.type';
import type { PixelViewportHandle } from '../../PixelViewport';

const useRevealActive = (viewport: RefObject<PixelViewportHandle | null>, items: readonly SheetItem[], activeId: string | null): void => {
  const held = useRef(items);
  useEffect(() => {
    held.current = items;
  }, [items]);
  useEffect(() => {
    if (activeId === null) return;
    const item = held.current.find((each) => each.onSheet && each.sprite.id === activeId);
    if (item) viewport.current?.reveal({ x: item.at.x + item.sprite.width / 2, y: item.at.y + item.sprite.height / 2 });
  }, [viewport, activeId]);
};

export { useRevealActive };
