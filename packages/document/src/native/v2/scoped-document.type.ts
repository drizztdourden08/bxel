/* @layer core @kind types */
import type { ExportPreset } from '../../model/export-preset.type';
import type { PaletteBank } from '../../model/palette.type';
import type { SpriteJson } from '../document-json.type';

type ScopedParts = {
  readonly banks: readonly PaletteBank[];
  readonly sprites: readonly SpriteJson[];
  readonly presets: readonly ExportPreset[];
};

export type { ScopedParts };
