/* @layer core @kind types */
import type { Artwork } from './artwork.type';
import type { ASSET_KIND } from './asset-format.constants';

type AssetKind = (typeof ASSET_KIND)[keyof typeof ASSET_KIND];

type AssetRef = { readonly id: string; readonly path: string };

type AssetContent = Partial<Pick<Artwork, 'banks' | 'sprites' | 'sheets' | 'presets' | 'tilesets' | 'tilemaps'>>;

type AssetSlice = {
  readonly kind: AssetKind;
  readonly id: string;
  readonly name: string;
  readonly artwork: AssetContent;
  readonly links: readonly AssetRef[];
};

export type { AssetContent, AssetKind, AssetRef, AssetSlice };
