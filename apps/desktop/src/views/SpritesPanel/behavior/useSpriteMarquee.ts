/* @layer renderer-app @kind hook */
import { useMarqueeSelect } from '@drizztdourden08/tessera';
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { RefObject } from 'react';
import type { SpriteId } from '@bxel/document';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { GRID_CELL } from '../SpritesPanel.constants';
import type { ManagerModel, SpriteMarquee } from '../SpritesPanel.type';

const useSpriteMarquee = (model: ManagerModel, grid: RefObject<VirtualGridHandle | null>): SpriteMarquee => {
  const area = useRef<HTMLElement | null>(null);
  const dragged = useRef(false);
  const known = new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id]));
  const marquee = useMarqueeSelect({
    containerRef: area,
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
