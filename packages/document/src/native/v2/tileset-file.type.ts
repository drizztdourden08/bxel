/* @layer core @kind types */
import type { PaletteBank } from '../../model/palette.type';
import type { Tileset } from '../../model/tilemap.type';
import type { SpriteJson } from '../document-json.type';

type TilesetFileJson = {
  readonly tileset: Tileset;
  readonly sprites: readonly SpriteJson[];
  readonly palette: PaletteBank;
};

export type { TilesetFileJson };
