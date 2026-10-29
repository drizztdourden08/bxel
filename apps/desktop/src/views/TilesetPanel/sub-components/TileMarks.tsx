/* @layer renderer-app @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { markTile } from '../../../tilemap/terrain/mark-tile';
import { maskOfTile } from '../../../tilemap/terrain/mask-of-tile';
import { BIT_WORDS, GLYPH_ORDER, KIND_BITS, TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TileMarksProps } from '../behavior/terrain-panel.type';

const TileMarks = ({ view, cell }: TileMarksProps) => {
  const { terrain } = view;
  const draft = useTilesetViewStore((state) => state.markDrafts[cell.tile.key]);
  const setDraft = useTilesetViewStore((state) => state.setMarkDraft);
  if (!terrain) return null;
  const mask = draft ?? maskOfTile(terrain.set, cell.tile.key) ?? 0;
  const toggle = (bit: number): void => {
    const next = mask ^ bit;
    const made = markTile(terrain.set, cell.tile.key, next);
    if (!made) {
      setDraft(cell.tile.key, next);
      return;
    }
    setDraft(cell.tile.key, null);
    setTerrainSets(terrain.sets.map((each) => (each.id === terrain.set.id ? made : each)), TERRAIN_TEXT.marks);
  };
  return (
    <Box className="tileset-panel__marks" data-bad={draft === undefined ? undefined : ''} title={draft === undefined ? undefined : TERRAIN_TEXT.badMask}>
      {GLYPH_ORDER.map((bit, at) =>
        bit === 0 || (KIND_BITS[terrain.set.kind] & bit) === 0 ? (
          <Box key={at} className="tileset-panel__mark tileset-panel__mark--off" aria-hidden="true" />
        ) : (
          <Pressable
            key={at}
            type="button"
            className="tileset-panel__mark"
            aria-pressed={(mask & bit) !== 0}
            aria-label={TERRAIN_TEXT.mark(BIT_WORDS.find(([each]) => each === bit)?.[1] ?? '')}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => toggle(bit)}
          />
        ),
      )}
    </Box>
  );
};

export { TileMarks };
