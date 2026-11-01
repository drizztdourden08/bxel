/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';
import { isTurned } from '../../../tilemap/terrain/is-turned';
import { maskOfTile } from '../../../tilemap/terrain/mask-of-tile';
import { slotOfMask } from '../../../tilemap/terrain/slot-of-mask';
import { GLYPH_ORDER, TERRAIN_KIND_CHOICES } from '../../../tilemap/terrain/terrain.constants';

const fillKey = (set: TerrainSet): number | null => {
  const full = TERRAIN_KIND_CHOICES.find((choice) => choice.kind === set.kind)?.glyph ?? 0;
  const variants = set.slots[slotOfMask(set.kind, full)] ?? [];
  return (variants.find((variant) => !isTurned(variant)) ?? variants[0])?.key ?? null;
};

const neighbourKey = (bit: number, mask: number, fill: number): number | null => ((mask & bit) !== 0 ? fill : null);

const terrainContext = (set: TerrainSet | undefined, key: number): readonly (number | null)[] => {
  const mask = set ? maskOfTile(set, key) : null;
  if (!set || mask === null) return GLYPH_ORDER.map(() => key);
  const fill = fillKey(set) ?? key;
  return GLYPH_ORDER.map((bit) => (bit === 0 ? key : neighbourKey(bit, mask, fill)));
};

export { terrainContext };
