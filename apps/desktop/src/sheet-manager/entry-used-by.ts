/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';

const add = (found: Map<string, Set<string>>, id: string, name: string): void => {
  const names = found.get(id) ?? new Set<string>();
  names.add(name);
  found.set(id, names);
};

const entryUsedBy = (artwork: Artwork, ownSheetId: string | null): ReadonlyMap<string, string> => {
  const found = new Map<string, Set<string>>();
  for (const animation of artwork.animations) for (const frame of animation.frames) if (frame.spriteId !== null) add(found, frame.spriteId, animation.name);
  for (const tileset of artwork.tilesets) {
    for (const tile of tileset.tiles) {
      add(found, tile.spriteId, tileset.name);
      if (tile.animation) add(found, tile.animation.animationId, tileset.name);
    }
  }
  for (const sheet of artwork.sheets) {
    if (sheet.id === ownSheetId) continue;
    for (const entry of sheet.entries) add(found, entry.spriteId, sheet.name);
    for (const entry of sheet.animationEntries ?? []) add(found, entry.animationId, sheet.name);
  }
  return new Map([...found].map(([id, names]) => [id, [...names].join(', ')]));
};

export { entryUsedBy };
