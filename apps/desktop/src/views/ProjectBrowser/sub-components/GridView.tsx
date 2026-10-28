/* @layer renderer-app @kind component */
import { MarqueeBox, VirtualGrid, useMarqueeSelect } from '@drizztdourden08/tessera';
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { BROWSER_TEXT, TILE_OF } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { FileTile } from './FileTile';

const GridView = () => {
  const { model, selection, thumb } = useBrowserContext();
  const area = useRef<HTMLElement>(null);
  const grid = useRef<VirtualGridHandle>(null);
  const marquee = useMarqueeSelect({
    containerRef: area,
    selected: selection,
    onChange: (ids) => useBrowserStore.getState().select({ ids, anchor: ids[0] ?? null }),
    getRects: () => grid.current?.getRects() ?? [],
    canStart: (event) => !(event.target instanceof Element && event.target.closest('[data-marquee-key]')),
  });
  const tile = TILE_OF[thumb] ?? TILE_OF[96];
  return (
    <VirtualGrid
      ref={grid}
      className="browser-grid"
      label={BROWSER_TEXT.gridLabel}
      items={model.entries}
      getKey={(entry) => entry.id}
      tileWidth={tile?.width}
      tileHeight={tile?.height}
      scrollRef={area}
      bind={marquee.bind}
      overlay={<MarqueeBox rect={marquee.rect} />}
      renderTile={(entry, _at, cell) => <FileTile entry={entry} cell={cell} />}
    />
  );
};

export { GridView };
