/* @layer renderer-app @kind logic */
import type { UsageSource } from './usage-source.type';

type Found = Map<string, Set<string>>;

const add = (found: Found, id: string, name: string): void => {
  const names = found.get(id) ?? new Set<string>();
  names.add(name);
  found.set(id, names);
};

const addAnimationUses = (found: Found, artwork: UsageSource): void => {
  for (const animation of artwork.animations) {
    for (const frame of animation.frames) if (frame.spriteId !== null) add(found, frame.spriteId, animation.name);
  }
};

const addTilesetUses = (found: Found, artwork: UsageSource): void => {
  for (const tileset of artwork.tilesets) {
    for (const tile of tileset.tiles) {
      add(found, tile.spriteId, tileset.name);
      if (tile.animation) add(found, tile.animation.animationId, tileset.name);
    }
  }
};

const addSheetUses = (found: Found, artwork: UsageSource, ownSheetId: string | null): void => {
  for (const sheet of artwork.sheets) {
    if (sheet.id === ownSheetId) continue;
    for (const entry of sheet.entries) add(found, entry.spriteId, sheet.name);
    for (const entry of sheet.animationEntries ?? []) add(found, entry.animationId, sheet.name);
  }
};

const entryUsedBy = (artwork: UsageSource, ownSheetId: string | null): ReadonlyMap<string, string> => {
  const found: Found = new Map();
  addAnimationUses(found, artwork);
  addTilesetUses(found, artwork);
  addSheetUses(found, artwork, ownSheetId);
  return new Map([...found].map(([id, names]) => [id, [...names].join(', ')]));
};

export { entryUsedBy };
