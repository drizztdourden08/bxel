/* @layer core @kind types */
import type { ArtworkId } from '../model/ids.type';

type ManifestEntry = { readonly path: string; readonly length: number; readonly crc32: string };

type Manifest = {
  readonly format: 'bxel';
  readonly formatVersion: number;
  readonly minReaderVersion: number;
  readonly writer: { readonly app: string; readonly version: string };
  readonly savedAt: string;
  readonly artworkId: ArtworkId;
  readonly document: string;
  readonly preview: string | null;
  readonly entries: readonly ManifestEntry[];
};

export type { Manifest, ManifestEntry };
