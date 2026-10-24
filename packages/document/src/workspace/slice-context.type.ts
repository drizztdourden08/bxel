/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';
import type { AssetPaths } from './asset-paths.type';

type SliceContext = {
  readonly artwork: Artwork;
  readonly paths: AssetPaths;
  readonly owners: ReadonlyMap<string, string>;
  readonly own: string;
};

export type { SliceContext };
