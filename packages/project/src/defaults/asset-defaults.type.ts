/* @layer core @kind types */
import type { FolderId } from '../ids/id.type';

type PaletteDefault =
  | { readonly kind: 'preset'; readonly presetId: string }
  | { readonly kind: 'file'; readonly folderId: FolderId; readonly path: string };

type PixelSize = { readonly width: number; readonly height: number };

type AssetDefaults = {
  readonly size: PixelSize;
  readonly colorLimit: number;
  readonly palette: PaletteDefault;
  readonly platformId: string | null;
  readonly platformStrict: boolean;
  readonly transparent: boolean;
  readonly frameDurationMs: number;
  readonly pixelGrid: PixelSize;
};

type ProjectDefaults = Partial<AssetDefaults>;

export type { AssetDefaults, PaletteDefault, PixelSize, ProjectDefaults };
