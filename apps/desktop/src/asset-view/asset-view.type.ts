/* @layer renderer-app @kind types */
import type { Size } from '@bxel/document';
import type { ReferenceImage } from './reference-image.type';

type BackgroundKind = 'checker' | 'solid';

interface AssetView {
  tileGrid: Size | null;
  majorEvery: number | null;
  background: BackgroundKind;
  backgroundColour: string;
  labels: boolean;
  overlaps: boolean;
  pivots: boolean;
  references: readonly ReferenceImage[];
}

interface AssetGridDefaults {
  tile: Size | null;
  source: AssetGridSource;
}

type AssetGridSource = 'tileset' | 'map' | 'sheet' | 'setting';

export type { AssetGridDefaults, AssetView, BackgroundKind };
