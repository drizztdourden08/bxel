/* @layer renderer-app @kind test */
import type { BankId, Tileset, TilesetId } from '@bxel/document';

const tilesetOf = (count: number): Tileset => ({
  id: 'tls_one' as TilesetId,
  name: 'one',
  bankId: 'bnk_one' as BankId,
  tileWidth: 2,
  tileHeight: 2,
  nextKey: count + 1,
  tiles: Array.from({ length: count }, (_, at) => ({
    id: `til_${at}` as Tileset['tiles'][number]['id'],
    key: at + 1,
    spriteId: `spr_${at}` as Tileset['tiles'][number]['spriteId'],
  })),
});

export { tilesetOf };
