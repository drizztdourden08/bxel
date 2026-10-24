/* @layer core @kind types */
import type { AssetKind, AssetRef } from '../../model/asset.type';
import type { ManifestEntry } from '../manifest.type';

type AssetManifest = {
  readonly format: 'bxel';
  readonly kind: AssetKind;
  readonly formatVersion: number;
  readonly minReaderVersion: number;
  readonly writer: { readonly app: string; readonly version: string };
  readonly savedAt: string;
  readonly assetId: string;
  readonly name: string;
  readonly document: string;
  readonly preview: string | null;
  readonly links: readonly AssetRef[];
  readonly entries: readonly ManifestEntry[];
};

export type { AssetManifest };
