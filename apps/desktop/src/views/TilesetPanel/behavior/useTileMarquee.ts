/* @layer renderer-app @kind hook */
import { useMarqueeSelect } from '@drizztdourden08/tessera';
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { TileMarquee, TilesetModel } from '../TilesetPanel.type';
import { marqueeStamp } from './marquee-stamp';
import { slotKey } from './slot-key';

const useTileMarquee = (model: TilesetModel, grid: RefObject<VirtualGridHandle | null>): TileMarquee => {
  const area = useRef<HTMLElement | null>(null);
  const marquee = useMarqueeSelect({
    containerRef: area,
    itemSelector: '[data-marquee-key]',
    getRects: () => grid.current?.getRects() ?? [],
    selected: model.selected.map((key) => `tile-${key}`),
    enabled: model.editMode !== 'edit',
    onChange: (keys) => {
      const wanted = new Set(keys);
      const picked = model.slots.flatMap((slot, index) => (wanted.has(slotKey(slot, index)) ? [index] : []));
      useTilemapStore.getState().setStamp(marqueeStamp(model.layout, picked));
    },
  });
  return { area, rect: marquee.rect, bind: marquee.bind };
};

export { useTileMarquee };
