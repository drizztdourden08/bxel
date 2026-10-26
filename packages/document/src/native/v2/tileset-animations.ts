/* @layer core @kind logic */
import type { Tileset } from '../../model/tilemap.type';

const tilesetAnimations = (tileset: Tileset): readonly string[] => [
  ...new Set(tileset.tiles.flatMap((tile) => (tile.animation ? [tile.animation.animationId] : []))),
];

export { tilesetAnimations };
