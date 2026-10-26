/* @layer renderer-app @kind hook */
import { useMarqueeSelect } from '@drizztdourden08/tessera';
import type { DataTableHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { RefObject } from 'react';
import type { SpriteId } from '@bxel/document';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { GRID_CELL, MARQUEE_ITEM, MARQUEE_SKIP } from '../SpritesPanel.constants';
import type { ManagerModel, SpriteMarquee } from '../SpritesPanel.type';

const useSpriteMarquee = (model: ManagerModel, grid: RefObject<Pick<DataTableHandle, 'getRects'> | null>): SpriteMarquee => {
  const area = useRef<HTMLElement | null>(null);
  const dragged = useRef(false);
  const known = new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id]));
  const marquee = useMarqueeSelect({
    containerRef: area,
    itemSelector: MARQUEE_ITEM,
    canStart: (event) => event.target instanceof Element && event.target.closest(`${MARQUEE_ITEM}, ${MARQUEE_SKIP}`) === null,
    getRects: () => grid.current?.getRects() ?? [],
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
      marquee.bind.onPointerDown(event);
    },
    onClick: (event) => {
      const onCell = event.target instanceof Element && event.target.closest(GRID_CELL) !== null;
      if (!dragged.current && !onCell) clearSpriteSelection();
    },
  };
};

export { useSpriteMarquee };
