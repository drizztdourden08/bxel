/* @layer renderer-app @kind hook */
import { useMarqueeSelect } from '@drizztdourden08/tessera';
import type { MarqueeItem } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { SpriteId } from '@bxel/document';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { MARQUEE_ITEM } from '../SpritesPanel.constants';
import type { ManagerModel, SpriteMarquee } from '../SpritesPanel.type';

const useSpriteMarquee = (model: ManagerModel, rectsOf?: (area: HTMLElement) => readonly MarqueeItem[]): SpriteMarquee => {
  const area = useRef<HTMLElement | null>(null);
  const dragged = useRef(false);
  const known = new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id]));
  const marquee = useMarqueeSelect({
    containerRef: area,
    itemSelector: MARQUEE_ITEM,
    ...(rectsOf ? { getRects: () => (area.current ? rectsOf(area.current) : []) } : {}),
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
      const onTile = event.target instanceof Element && event.target.closest(MARQUEE_ITEM) !== null;
      if (!dragged.current && !onTile) clearSpriteSelection();
    },
  };
};

export { useSpriteMarquee };
