/* @layer core @kind types */
import type { AssetRef, AssetSlice } from '../../model/asset.type';
import type { DamagedCel } from '../load-report.type';
import type { ReadAsset } from './read-asset.type';
import type { TilesetFileJson } from './tileset-file.type';

type ReadTileset = Omit<ReadAsset, 'json'> & { readonly file: TilesetFileJson };

type BuiltTileset = {
  readonly slice: AssetSlice;
  readonly damage: readonly DamagedCel[];
  readonly missing: readonly AssetRef[];
};

export type { BuiltTileset, ReadTileset };
