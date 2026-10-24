/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';

const referrersOf = (artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  if (key.kind === 'sprite') {
    return artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === key.id)).map((sheet) => ({ kind: 'sheet', id: sheet.id }));
  }
  if (key.kind === 'palette') {
    return [
      ...artwork.sprites.filter((sprite) => sprite.role !== 'tile' && sprite.bankId === key.id).map((sprite) => ({ kind: 'sprite' as const, id: sprite.id })),
      ...artwork.tilesets.filter((tileset) => tileset.bankId === key.id).map((tileset) => ({ kind: 'tileset' as const, id: tileset.id })),
    ];
  }
  if (key.kind === 'tileset') {
    return artwork.tilemaps.filter((tilemap) => tilemap.tilesetId === key.id).map((tilemap) => ({ kind: 'tilemap', id: tilemap.id }));
  }
  return [];
};

export { referrersOf };
