/* @layer core @kind types */
import type { CelId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';
import type { MapLayer, Tilemap } from '../model/tilemap.type';

type SpriteJson = Omit<Sprite, 'cels'> & { readonly celIds: readonly CelId[] };
type MapLayerJson = Omit<MapLayer, 'cells'>;
type TilemapJson = Omit<Tilemap, 'layers'> & { readonly layers: readonly MapLayerJson[] };

type DocumentJson = Omit<Artwork, 'sprites' | 'tilemaps'> & {
  readonly sprites: readonly SpriteJson[];
  readonly tilemaps: readonly TilemapJson[];
};

export type { DocumentJson, MapLayerJson, SpriteJson, TilemapJson };
