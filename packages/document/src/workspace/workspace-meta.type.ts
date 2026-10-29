/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { SavedBrush } from '../model/brush.type';
import type { ExportPreset } from '../model/export-preset.type';

type WorkspaceMeta = Pick<Artwork, 'id' | 'name' | 'defaultBankId' | 'coverSpriteId' | 'platformId' | 'platformStrict'> & {
  readonly presets: readonly ExportPreset[];
  readonly brushes?: readonly SavedBrush[];
};

export type { WorkspaceMeta };
