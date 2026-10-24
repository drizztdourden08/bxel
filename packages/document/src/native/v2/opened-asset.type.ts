/* @layer core @kind types */
import type { ArchiveContents } from '../archive.type';
import type { AssetManifest } from './asset-manifest.type';

type OpenedAsset = {
  readonly archive: ArchiveContents;
  readonly manifest: AssetManifest;
  readonly readOnly: boolean;
  readonly notice: string | null;
};

export type { OpenedAsset };
