/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { findSprite, terrainSetsOf, tileLayout, tileUseCounts } from '@bxel/document';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { TileCell, TilesetModel } from '../TilesetPanel.type';
import { slotOfTile } from '../../../tilemap/terrain/slot-of-tile';
import { chosenSet } from '../../../tilemap/terrain/chosen-set';
import { tileMatches } from './tile-matches';

const useTilesetModel = (): TilesetModel | null => {
  const context = useMapContext();
  const stamp = useTilemapStore((state) => state.stamp);
  const editMode = useTilemapStore((state) => state.editMode);
  const editKey = useTilemapStore((state) => state.editKey);
  const mapSelected = useTilemapStore((state) => state.selection !== null);
  const search = useTilesetViewStore((state) => state.search);
  const filters = useTilesetViewStore((state) => state.filters);
  const choices = useTilesetViewStore((state) => state.choices);
  const terrainSetId = useTilesetViewStore((state) => state.terrainSetId);
  const artwork = context?.artwork ?? null;
  const tileset = context?.tileset ?? null;
  const hasMap = context?.tilemap != null;
  const counts = useMemo(() => (artwork && tileset ? tileUseCounts(artwork, tileset.id) : null), [artwork, tileset]);
  return useMemo(() => {
    if (!artwork || !tileset || !counts) return null;
    const layout = tileLayout(tileset);
    const active = chosenSet(terrainSetsOf(tileset), terrainSetId);
    const filtering = search.trim() !== '' || filters.length > 0 || choices.length > 0;
    const fields = tileset.fields ?? [];
    const cells = tileset.tiles.flatMap((tile): TileCell[] => {
      const sprite = findSprite(artwork, tile.spriteId);
      if (!sprite) return [];
      const uses = counts.get(tile.key) ?? 0;
      const base = { tile, sprite, uses, terrainSlot: slotOfTile(active, tile.key) };
      const matches = tileMatches({ ...base, name: sprite.name }, { search, filters, choices, fields });
      return [{ ...base, picked: stamp.keys.includes(tile.key), editing: editMode === 'edit' && editKey === tile.key, index: layout.indexOf.get(tile.key) ?? 0, matches }];
    });
    const byKey = new Map(cells.map((cell) => [cell.tile.key, cell]));
    const slots = layout.slots.map((tile) => (tile ? (byKey.get(tile.key) ?? null) : null));
    const selected = stamp.keys.filter((key) => key !== 0);
    return {
      artwork,
      tileset,
      layout,
      cells,
      slots,
      byKey,
      editMode,
      stamp,
      selected,
      pickedKey: selected[0] ?? null,
      mapSelected,
      filtering,
      matched: cells.filter((cell) => cell.matches).length,
      hasMap,
    };
  }, [artwork, tileset, counts, stamp, editMode, editKey, mapSelected, search, filters, choices, hasMap, terrainSetId]);
};

export { useTilesetModel };
