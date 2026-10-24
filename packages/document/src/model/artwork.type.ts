/* @layer core @kind types */
import type { ExportPreset } from './export-preset.type';
import type { BankId, DocumentId, ArtworkId, SpriteId } from './ids.type';
import type { PaletteBank } from './palette.type';
import type { Sheet } from './sheet.type';
import type { Sprite } from './sprite.type';
import type { Tilemap, Tileset } from './tilemap.type';

type Artwork = {
  readonly id: ArtworkId;
  readonly name: string;
  readonly defaultBankId: BankId;
  readonly coverSpriteId: SpriteId | null;
  readonly banks: readonly PaletteBank[];
  readonly sprites: readonly Sprite[];
  readonly sheets: readonly Sheet[];
  readonly presets: readonly ExportPreset[];
  readonly tilesets: readonly Tileset[];
  readonly tilemaps: readonly Tilemap[];
};

type DocumentState = {
  readonly documentId: DocumentId;
  readonly revision: number;
  readonly artwork: Artwork;
  readonly readOnly: boolean;
};

export type { DocumentState, Artwork };
