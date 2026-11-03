/* @layer renderer-app @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { applyMark } from '../../../tilemap/terrain/apply-mark';
import { maskOfTile } from '../../../tilemap/terrain/mask-of-tile';
import { BIT_WORDS, GLYPH_ORDER, KIND_BITS, TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { markDrag } from '../behavior/mark-drag';
import type { TileMarksProps } from '../behavior/terrain-panel.type';
import { MARK_ATTR } from '../TilesetPanel.constants';

const TileMarks = ({ view, cell }: TileMarksProps) => {
  const { terrain } = view;
  const draft = useTilesetViewStore((state) => state.markDrafts[cell.tile.key]);
  if (!terrain) return null;
  const mask = draft ?? maskOfTile(terrain.set, cell.tile.key) ?? 0;
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
            {...{ [MARK_ATTR.key]: cell.tile.key, [MARK_ATTR.bit]: bit }}
            onPointerDown={(event) => markDrag(event, cell.tile.key, bit, event.button === 2 ? false : (mask & bit) === 0)}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') applyMark(cell.tile.key, bit, (mask & bit) === 0);
            }}
          />
        ),
      )}
    </Box>
  );
};

export { TileMarks };
