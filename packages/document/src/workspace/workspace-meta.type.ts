/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { SavedBrush } from '../model/brush.type';
import type { ExportPreset } from '../model/export-preset.type';
import type { SavedPattern } from '../model/pattern.type';

type WorkspaceMeta = Pick<Artwork, 'id' | 'name' | 'defaultBankId' | 'coverSpriteId' | 'platformId' | 'platformStrict'> & {
  readonly presets: readonly ExportPreset[];
  readonly brushes?: readonly SavedBrush[];
  readonly patterns?: readonly SavedPattern[];
};

export type { WorkspaceMeta };
