/* @layer renderer-app @kind types */
import type { Artwork, AssetKind } from '@bxel/document';
import type { Workspace } from '../workspace/workspace.type';

type RowKind = Exclude<AssetKind, 'project'> | 'image' | 'other';

type AssetChip = 'all' | 'sprite' | 'sheet' | 'palette' | 'tilemap' | 'image' | 'other';

type AssetSort = 'name' | 'kind' | 'modified' | 'created' | 'folder';

type AssetRow = {
  readonly id: string;
  readonly kind: RowKind;
  readonly assetId: string | null;
  readonly name: string;
  readonly path: string;
  readonly folder: string;
  readonly modified: number;
  readonly created: number | null;
  readonly dirty: boolean;
  readonly loaded: boolean;
  readonly usedBy: readonly string[];
  readonly preview: string | null;
};

type AssetQuery = {
  readonly chip: AssetChip;
  readonly sort: AssetSort;
  readonly search: string;
  readonly usedBySprite: string | null;
};

type FileStat = { readonly modified: number; readonly size: number };

type ListedFile = FileStat & { readonly path: string; readonly name: string };

type RowsInput = {
  readonly workspace: Workspace;
  readonly artwork: Artwork;
  readonly files: readonly ListedFile[];
};

type ChipCount = { readonly chip: AssetChip; readonly count: number };

type ChipOption = { readonly value: AssetChip; readonly label: string };

type SortOption = { readonly value: AssetSort; readonly label: string };

export type { AssetChip, AssetQuery, AssetRow, AssetSort, ChipCount, ChipOption, FileStat, ListedFile, RowKind, RowsInput, SortOption };
