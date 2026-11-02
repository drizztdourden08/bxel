/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { GRID_PADDING } from '../TilesetPanel.constants';
import { capZoom } from './cap-zoom';
import { fitZoom } from './fit-zoom';
import { useTerrainSet } from './useTerrainSet';
import type { TilesetModel } from '../TilesetPanel.type';
import type { GridViewHandle } from './useGridView.type';

const useGridView = (model: TilesetModel, painted: ReadonlySet<number>): GridViewHandle => {
  const ref = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  const store = useTilesetViewStore();
  const animateTiles = useTilemapStore((state) => state.animateTiles);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const watcher = new ResizeObserver((entries) => setWidth(entries[0]?.contentRect.width ?? 0));
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);
  const { columns } = model.layout;
  const zoom = store.zoom === 'fit' ? fitZoom(model.tileset, columns, width - GRID_PADDING) : capZoom(model.tileset, store.zoom);
  const { sets, set } = useTerrainSet(model);
  const order = new Map(model.selected.map((key, at) => [key, at + 1]));
  return {
    ref,
    view: {
      artwork: model.artwork,
      tileset: model.tileset,
      mode: store.mode,
      zoom,
      showKeys: store.showKeys,
      showUses: store.showUses,
      animate: animateTiles,
      painted,
      order,
      terrain: set ? { set, sets } : null,
    },
  };
};

export { useGridView };
