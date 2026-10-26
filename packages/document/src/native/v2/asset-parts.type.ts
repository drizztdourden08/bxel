/* @layer core @kind types */
import type { AssetSlice } from '../../model/asset.type';

type AssetHeader = Pick<AssetSlice, 'kind' | 'id' | 'name' | 'links'>;

type AssetParts = {
  readonly header: AssetHeader;
  readonly savedAt: number;
  readonly readerVersion: number;
  readonly documentBytes: Uint8Array;
  readonly preview: Uint8Array | null;
  readonly blobs: ReadonlyMap<string, Uint8Array>;
};

type AssetExtras = Pick<AssetParts, 'preview' | 'blobs'> & { readonly readerVersion?: number };

export type { AssetExtras, AssetHeader, AssetParts };
