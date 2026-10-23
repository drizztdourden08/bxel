/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { Project } from '../model/project.type';
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

const toDocumentJson = (project: Project): DocumentJson => ({
  id: project.id,
  name: project.name,
  defaultBankId: project.defaultBankId,
  coverSpriteId: project.coverSpriteId,
  banks: project.banks,
  sprites: project.sprites.map(spriteToJson),
  sheets: project.sheets,
  presets: project.presets,
  tilesets: project.tilesets,
  tilemaps: project.tilemaps.map(tilemapToJson),
});

export { toDocumentJson };
