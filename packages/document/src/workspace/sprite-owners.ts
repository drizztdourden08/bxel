/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';

type Pair = readonly [string, string];

const spriteOwners = (artwork: Artwork): ReadonlyMap<string, string> => {
  const owned = new Set(artwork.sprites.filter((sprite) => sprite.role === 'frame').map((sprite) => sprite.id));
  const tiles = artwork.tilesets.flatMap((tileset) => tileset.tiles.map((tile): Pair => [tile.spriteId, tileset.id]));
  const frames = artwork.animations.flatMap((animation) =>
    animation.frames.flatMap((frame): Pair[] =>
      frame.spriteId !== null && owned.has(frame.spriteId) ? [[frame.spriteId, animation.id]] : [],
    ),
  );
  return new Map([...tiles, ...frames]);
};

export { spriteOwners };
