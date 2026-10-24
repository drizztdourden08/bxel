/* @layer core @kind types */
import type { ExportPreset } from '../../model/export-preset.type';
import type { PaletteBank } from '../../model/palette.type';
import type { SpriteJson } from '../document-json.type';

type SpriteFileJson = {
  readonly sprite: SpriteJson;
  readonly palette: PaletteBank;
  readonly presets: readonly ExportPreset[];
};

export type { SpriteFileJson };
