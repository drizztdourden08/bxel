/* @layer renderer-app @kind types */
import type { Size } from '@bxel/document';

type BackgroundKind = 'checker' | 'solid';

interface AssetView {
  tileGrid: Size | null;
  majorEvery: number | null;
  background: BackgroundKind;
  backgroundColour: string;
}

interface AssetGridDefaults {
  tile: Size | null;
  source: AssetGridSource;
}

type AssetGridSource = 'tileset' | 'map' | 'sheet' | 'setting';

export type { AssetGridDefaults, AssetGridSource, AssetView, BackgroundKind };
