/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { findSprite, tileUseCounts } from '@bxel/document';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { TileCell, TilesetModel } from '../TilesetPanel.type';

const useTilesetModel = (): TilesetModel | null => {
  const context = useMapContext();
  const stamp = useTilemapStore((state) => state.stamp);
  const editMode = useTilemapStore((state) => state.editMode);
  const editKey = useTilemapStore((state) => state.editKey);
  const selected = useTilemapStore((state) => state.selection !== null);
  const artwork = context?.artwork ?? null;
  const tileset = context?.tileset ?? null;
  const counts = useMemo(() => (artwork && tileset ? tileUseCounts(artwork, tileset.id) : null), [artwork, tileset]);
  return useMemo(() => {
    if (!artwork || !tileset || !counts) return null;
    const cells = tileset.tiles.flatMap((tile): TileCell[] => {
      const sprite = findSprite(artwork, tile.spriteId);
      const picked = stamp.keys.includes(tile.key);
      return sprite ? [{ tile, sprite, uses: counts.get(tile.key) ?? 0, picked, editing: editMode === 'edit' && editKey === tile.key }] : [];
    });
    const pickedKey = stamp.keys.find((key) => key !== 0) ?? null;
    return { artwork, tileset, cells, editMode, stamp, selected, pickedKey };
  }, [artwork, tileset, counts, stamp, editMode, editKey, selected]);
};

export { useTilesetModel };
