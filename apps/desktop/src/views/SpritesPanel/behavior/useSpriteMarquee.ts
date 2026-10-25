/* @layer renderer-app @kind hook */
import { useMarqueeSelect } from '@drizztdourden08/tessera';
import type { MarqueeItem } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { SpriteId } from '@bxel/document';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { GRID_CELL, MARQUEE_ITEM } from '../SpritesPanel.constants';
import type { ManagerModel, SpriteMarquee } from '../SpritesPanel.type';
import { rememberRects } from './remember-rects';

const useSpriteMarquee = (model: ManagerModel): SpriteMarquee => {
  const area = useRef<HTMLElement | null>(null);
  const dragged = useRef(false);
  const seen = useRef(new Map<string, MarqueeItem>());
  const known = new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id]));
  const marquee = useMarqueeSelect({
    containerRef: area,
    itemSelector: MARQUEE_ITEM,
    getRects: () => rememberRects(area.current, seen.current),
    selected: model.ids,
    onChange: (keys) => {
      dragged.current = true;
      selectIds(keys.flatMap((key) => known.get(key) ?? []));
    },
  });
  return {
    area,
    rect: marquee.rect,
    onPointerDown: (event) => {
      dragged.current = false;
      seen.current.clear();
      marquee.bind.onPointerDown(event);
    },
    onClick: (event) => {
      const onCell = event.target instanceof Element && event.target.closest(GRID_CELL) !== null;
      if (!dragged.current && !onCell) clearSpriteSelection();
    },
  };
};

export { useSpriteMarquee };
