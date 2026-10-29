/* @layer renderer-app @kind logic */
import { slotMask } from '@bxel/document';
import type { TerrainSet, TerrainVariant, Tileset } from '@bxel/document';
import { isTurned } from './is-turned';
import { slotOfMask } from './slot-of-mask';
import { turnedMask } from './turned-mask';
import { turnedVariant } from './turned-variant';
import { FLIP_ONLY, WITH_TURNS } from './turn-flags.constants';

const turnsOf = (tileset: Tileset, key: number) => {
  const turns = tileset.tiles.find((tile) => tile.key === key)?.turns;
  if (turns === 'all') return WITH_TURNS;
  return turns === 'flips' ? FLIP_ONLY : [];
};

const isFree = (set: TerrainSet, found: ReadonlyMap<number, TerrainVariant>, at: { source: number; target: number }): boolean =>
  at.target >= 0 && at.target !== at.source && (set.slots[at.target]?.length ?? 0) === 0 && !found.has(at.target);

const turnsFrom = (set: TerrainSet, tileset: Tileset, source: number, found: Map<number, TerrainVariant>): void => {
  const first = set.slots[source]?.[0];
  if (!first || isTurned(first)) return;
  for (const flags of turnsOf(tileset, first.key)) {
    const target = slotOfMask(set.kind, turnedMask(slotMask(set.kind, source), flags));
    if (isFree(set, found, { source, target })) found.set(target, turnedVariant(first.key, flags));
  }
};

const emptyOr = (variant: TerrainVariant | undefined): readonly TerrainVariant[] => (variant ? [variant] : []);

const fillByTurning = (set: TerrainSet, tileset: Tileset): TerrainSet => {
  const found = new Map<number, TerrainVariant>();
  set.slots.forEach((_variants, source) => turnsFrom(set, tileset, source, found));
  return { ...set, slots: set.slots.map((variants, slot) => (variants.length === 0 ? emptyOr(found.get(slot)) : variants)) };
};

export { fillByTurning };
