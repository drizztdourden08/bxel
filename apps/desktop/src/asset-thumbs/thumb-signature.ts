/* @layer renderer-app @kind logic */
import { findBank, findSheet, findTilemap, findTileset } from '@bxel/document';
import type { Artwork, AssetKey, BankId, SheetId, TilemapId, TilesetId } from '@bxel/document';
import { objectId } from './object-id';

const assetOf = (artwork: Artwork, key: AssetKey): object | undefined => {
  if (key.kind === 'palette') return findBank(artwork, key.id as BankId);
  if (key.kind === 'sheet') return findSheet(artwork, key.id as SheetId);
  if (key.kind === 'tileset') return findTileset(artwork, key.id as TilesetId);
  return key.kind === 'tilemap' ? findTilemap(artwork, key.id as TilemapId) : undefined;
};

const thumbSignature = (artwork: Artwork, key: AssetKey): string =>
  [assetOf(artwork, key), artwork.sprites, artwork.banks, artwork.animations, artwork.tilesets].map(objectId).join(':');

export { thumbSignature };
