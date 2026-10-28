/* @layer renderer-app @kind types */
import type { AssetRow, ListedFile, RowKind } from '../asset-list/asset-list.type';

type ItemKind = RowKind | 'folder' | 'project' | 'legacy' | 'group';

type ItemRole = 'folder' | 'linked' | 'group' | 'file' | 'ghost';

type ItemState = 'unsaved' | 'open' | 'missing' | 'unused';

type ViewMode = 'tree' | 'list';

type ViewDensity = 'compact' | 'comfortable' | 'grid';

type TileSize = 48 | 64 | 96;

type ListGroup = 'kind' | 'folder' | 'none';

type SortChoice = 'name' | 'kind' | 'modified' | 'created' | 'folder';

type BrowserRoot = {
  readonly path: string;
  readonly name: string;
  readonly main: boolean;
  readonly granted: boolean;
};

type BrowserItem = {
  readonly key: string;
  readonly parentKey: string | null;
  readonly role: ItemRole;
  readonly kind: ItemKind;
  readonly name: string;
  readonly fileName: string;
  readonly path: string;
  readonly rootKey: string | null;
  readonly row: AssetRow | null;
  readonly modified: number;
  readonly size: number;
  readonly readOnly: boolean;
  readonly failed: boolean;
};

type ItemTree = {
  readonly items: ReadonlyMap<string, BrowserItem>;
  readonly children: ReadonlyMap<string | null, readonly string[]>;
  readonly mainKey: string | null;
};

type TreeInput = {
  readonly roots: readonly BrowserRoot[];
  readonly folders: readonly string[];
  readonly files: readonly ListedFile[];
  readonly rows: readonly AssetRow[];
  readonly listed: boolean;
};

type ItemStatus = {
  readonly unsaved: boolean;
  readonly open: boolean;
  readonly active: boolean;
  readonly missing: readonly string[];
  readonly usedBy: number;
  readonly unused: boolean;
  readonly unsavedBelow: number;
  readonly missingBelow: number;
};

type StatusMap = ReadonlyMap<string, ItemStatus>;

type StatusInput = {
  readonly tree: ItemTree;
  readonly referrers: ReadonlyMap<string, readonly string[]>;
  readonly openKeys: ReadonlySet<string>;
  readonly activeKey: string | null;
};

type StatusContext = Pick<StatusInput, 'referrers' | 'openKeys' | 'activeKey'> & { readonly missing: ReadonlyMap<string, readonly string[]> };

type VisibleRow = {
  readonly item: BrowserItem;
  readonly depth: number;
  readonly posinset: number;
  readonly setsize: number;
  readonly expanded: boolean | null;
  readonly count?: number;
};

type ItemCompare = (left: BrowserItem, right: BrowserItem) => number;

type FilterResult = {
  readonly matches: ReadonlySet<string>;
  readonly visible: ReadonlySet<string>;
};

type FilterCounts = {
  readonly kinds: Readonly<Partial<Record<RowKind, number>>>;
  readonly states: Readonly<Record<ItemState, number>>;
};

export type {
  BrowserItem,
  BrowserRoot,
  FilterCounts,
  FilterResult,
  ItemCompare,
  ItemKind,
  ItemRole,
  ItemState,
  ItemStatus,
  ItemTree,
  ListGroup,
  SortChoice,
  StatusContext,
  StatusInput,
  StatusMap,
  TileSize,
  TreeInput,
  ViewDensity,
  ViewMode,
  VisibleRow,
};
