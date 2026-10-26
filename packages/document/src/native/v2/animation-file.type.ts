/* @layer core @kind types */
import type { Animation } from '../../model/animation.type';
import type { ExportPreset } from '../../model/export-preset.type';
import type { PaletteBank } from '../../model/palette.type';
import type { Sprite } from '../../model/sprite.type';
import type { SpriteJson } from '../document-json.type';

type AnimationFileJson = {
  readonly animation: Animation;
  readonly sprites: readonly SpriteJson[];
  readonly palette: PaletteBank;
  readonly presets: readonly ExportPreset[];
};

type AnimationEncoding = { readonly file: AnimationFileJson; readonly sprites: readonly Sprite[] };

export type { AnimationEncoding, AnimationFileJson };
