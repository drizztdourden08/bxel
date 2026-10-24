/* @layer core @kind types */
import type { AssetSlice } from '../model/asset.type';
import type { AssetKey } from './asset-key.type';
import type { WorkspaceMeta } from './workspace-meta.type';

type SplitEntry = { readonly key: AssetKey; readonly name: string };

type SplitFile = {
  readonly key: AssetKey;
  readonly name: string;
  readonly folder: string;
  readonly fileName: string;
  readonly path: string;
  readonly suffix: number;
  readonly renamed: boolean;
  readonly slice: AssetSlice;
};

type SplitConflict = { readonly folder: string; readonly fileName: string; readonly names: readonly string[] };

type SplitPlan = {
  readonly project: WorkspaceMeta;
  readonly files: readonly SplitFile[];
  readonly conflicts: readonly SplitConflict[];
};

type Placement = Omit<SplitFile, 'slice' | 'key' | 'name'> & { readonly entry: SplitEntry; readonly baseName: string };

export type { Placement, SplitConflict, SplitEntry, SplitFile, SplitPlan };
