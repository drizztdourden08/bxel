/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Layer, Sprite } from '../model/sprite.type';
import type { Tilemap } from '../model/tilemap.type';
import type { DocumentJson, SpriteJson, TilemapJson } from './document-json.type';

const sortedLayer = (layer: Layer): Layer => ({
  ...layer,
  cels: Object.fromEntries(Object.entries(layer.cels).sort(([left], [right]) => (left < right ? -1 : 1))),
});

const spriteToJson = (sprite: Sprite): SpriteJson => ({
  id: sprite.id,
  name: sprite.name,
  role: sprite.role,
  bankId: sprite.bankId,
  width: sprite.width,
  height: sprite.height,
  pivot: sprite.pivot,
  layers: sprite.layers.map(sortedLayer),
  frames: sprite.frames,
  tags: sprite.tags,
  slices: sprite.slices,
  celIds: Object.keys(sprite.cels).sort() as CelId[],
});

const tilemapToJson = (tilemap: Tilemap): TilemapJson => ({
  id: tilemap.id,
  name: tilemap.name,
  tilesetId: tilemap.tilesetId,
  columns: tilemap.columns,
  rows: tilemap.rows,
  layers: tilemap.layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
  })),
});

const toDocumentJson = (artwork: Artwork): DocumentJson => ({
  id: artwork.id,
  name: artwork.name,
  defaultBankId: artwork.defaultBankId,
  coverSpriteId: artwork.coverSpriteId,
  ...(artwork.platformId === undefined ? {} : { platformId: artwork.platformId }),
  ...(artwork.platformStrict === true ? { platformStrict: true } : {}),
  banks: artwork.banks,
  sprites: artwork.sprites.map(spriteToJson),
  sheets: artwork.sheets,
  presets: artwork.presets,
  tilesets: artwork.tilesets,
  tilemaps: artwork.tilemaps.map(tilemapToJson),
});

export { toDocumentJson };
