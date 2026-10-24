/* @layer renderer-app @kind types */
import type { AssetChip, AssetQuery, AssetRow, AssetSort, ChipCount } from '../../../../asset-list/asset-list.type';

type RowAction = (row: AssetRow) => void;

type AssetsModel = {
  readonly rows: readonly AssetRow[];
  readonly total: number;
  readonly counts: readonly ChipCount[];
  readonly query: AssetQuery;
  readonly usersOf: AssetRow | null;
  readonly renaming: AssetRow | null;
  readonly renameError: string | null;
  readonly setChip: (chip: AssetChip) => void;
  readonly setSort: (sort: AssetSort) => void;
  readonly showUsers: (row: AssetRow | null) => void;
  readonly open: RowAction;
  readonly startRename: RowAction;
  readonly stopRename: () => void;
  readonly rename: (name: string) => void;
  readonly reveal: RowAction;
  readonly duplicate: RowAction;
  readonly trash: RowAction;
  readonly copyForSheet: RowAction;
  readonly exportRow: RowAction;
};

type AssetsPartProps = { readonly model: AssetsModel };

type AssetRowProps = AssetsPartProps & { readonly row: AssetRow };

export type { AssetsModel, AssetsPartProps, AssetRowProps };
