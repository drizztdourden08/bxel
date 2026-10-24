/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import type { Sprite } from '../../model/sprite.type';
import { spriteShell } from './sprite-shell';
import type { TilesetEncoding } from './tileset-encoding.type';

const tileSprite = (sprites: readonly Sprite[], id: string): Sprite => {
  const found = sprites.find((sprite) => sprite.id === id);
  if (!found) throw new Error(`A tileset file needs the tile sprite ${id}.`);
  return found;
};

const tilesetToFile = (slice: AssetSlice): TilesetEncoding => {
  const { tilesets = [], sprites = [], banks = [] } = slice.artwork;
  const [tileset] = tilesets;
  if (tilesets.length !== 1 || !tileset) throw new Error('A tileset file holds exactly one tileset.');
  const palette = banks.find((bank) => bank.id === tileset.bankId);
  if (!palette) throw new Error(`A tileset file needs a copy of its palette ${tileset.bankId}.`);
  const tiles = tileset.tiles.map((tile) => tileSprite(sprites, tile.spriteId));
  return { file: { tileset, sprites: tiles.map(spriteShell), palette }, sprites: tiles };
};

export { tilesetToFile };
