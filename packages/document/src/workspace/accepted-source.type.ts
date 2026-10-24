/* @layer core @kind types */
import type { AssetSlice } from '../model/asset.type';

type AcceptedSource = {
  readonly index: number;
  readonly path: string;
  readonly oldId: string;
  readonly slice: AssetSlice;
  readonly map: ReadonlyMap<string, string>;
};

export type { AcceptedSource };
