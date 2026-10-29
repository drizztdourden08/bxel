/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { CELL_FRAME, GRID_PADDING, ZOOM_MAX } from '../TilesetPanel.constants';
import { useTerrainSet } from './useTerrainSet';
import type { TilesetModel } from '../TilesetPanel.type';
import type { GridViewHandle } from './useGridView.type';

const useGridView = (model: TilesetModel, focused: number, painted: ReadonlySet<number>): GridViewHandle => {
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
  const fit = Math.floor(((width - GRID_PADDING) / columns - CELL_FRAME) / model.tileset.tileWidth);
  const zoom = store.zoom === 'fit' ? Math.max(1, Math.min(ZOOM_MAX, fit)) : store.zoom;
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
      focused,
      order,
      terrain: set ? { set, sets } : null,
    },
  };
};

export { useGridView };
