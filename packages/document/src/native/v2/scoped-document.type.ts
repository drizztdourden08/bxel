/* @layer core @kind types */
import type { ExportPreset } from '../../model/export-preset.type';
import type { PaletteBank } from '../../model/palette.type';
import type { Sheet } from '../../model/sheet.type';
import type { Tileset } from '../../model/tilemap.type';
import type { SpriteJson, TilemapJson } from '../document-json.type';

type ScopedParts = {
  readonly banks?: readonly PaletteBank[];
  readonly sprites?: readonly SpriteJson[];
  readonly presets?: readonly ExportPreset[];
  readonly sheets?: readonly Sheet[];
  readonly tilesets?: readonly Tileset[];
  readonly tilemaps?: readonly TilemapJson[];
};

export type { ScopedParts };
