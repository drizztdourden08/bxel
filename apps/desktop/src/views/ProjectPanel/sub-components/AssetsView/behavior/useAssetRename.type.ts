/* @layer renderer-app @kind types */
import type { AssetRow } from '../../../../../asset-list/asset-list.type';

type AssetRename = {
  readonly renaming: AssetRow | null;
  readonly renameError: string | null;
  readonly startRename: (row: AssetRow) => void;
  readonly stopRename: () => void;
  readonly rename: (name: string) => void;
};

export type { AssetRename };
