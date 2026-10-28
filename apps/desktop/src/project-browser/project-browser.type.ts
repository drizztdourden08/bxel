/* @layer renderer-app @kind types */
import type { AssetRow, RowKind } from '../asset-list/asset-list.type';

type ItemKind = RowKind | 'folder' | 'project' | 'legacy' | 'group';

type ItemRole = 'folder' | 'linked' | 'group' | 'file' | 'ghost';

type ItemState = 'unsaved' | 'open' | 'missing' | 'unused';

type ViewMode = 'tree' | 'list';

type ViewDensity = 'compact' | 'comfortable' | 'grid';

type TileSize = 48 | 64 | 96;

type ListGroup = 'kind' | 'folder' | 'none';

type BrowserRoot = {
  readonly path: string;
  readonly name: string;
  readonly main: boolean;
  readonly granted: boolean;
};

type BrowserEntry = {
  readonly path: string;
  readonly name: string;
  readonly isFolder: boolean;
  readonly size: number;
  readonly modified: number;
  readonly rootPath: string;
};

type ListedEntries = {
  readonly entries: readonly BrowserEntry[];
  readonly truncated: boolean;
  readonly failed: readonly string[];
};

type BrowserSource = ListedEntries & {
  readonly roots: readonly BrowserRoot[];
  readonly ready: boolean;
  readonly refresh: () => void;
};

type BrowserModel = {
  readonly tree: ItemTree;
  readonly rows: readonly AssetRow[];
  readonly statuses: StatusMap;
  readonly referrers: ReadonlyMap<string, readonly string[]>;
  readonly activeKey: string | null;
  readonly documentId: string | null;
};

type BrowserView = ProjectViewSettings & {
  readonly expandedSet: ReadonlySet<string>;
  readonly collapsedGroups: ReadonlySet<string>;
  readonly openOnClick: boolean;
  readonly set: (change: Partial<ProjectViewSettings>) => void;
  readonly setOpen: (keys: readonly string[], open: boolean) => void;
  readonly toggleGroup: (key: string) => void;
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
  readonly entries: readonly BrowserEntry[];
  readonly failed: readonly string[];
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

type FilterCounts = {
  readonly kinds: Readonly<Partial<Record<RowKind, number>>>;
  readonly states: Readonly<Record<ItemState, number>>;
};

type StatusMap =ReadonlyMap<string, ItemStatus>;

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

type BrowserQuery = {
  readonly text: string;
  readonly kinds: readonly RowKind[];
  readonly states: readonly ItemState[];
  readonly usedBy: string | null;
  readonly inside: string | null;
};

type BrowserQueryState = {
  readonly search: string;
  readonly chips: BrowserQuery;
  readonly query: BrowserQuery;
  readonly setSearch: (text: string) => void;
  readonly toggleKind: (kind: RowKind) => void;
  readonly toggleState: (state: ItemState) => void;
  readonly setUsedBy: (name: string | null) => void;
  readonly setInside: (path: string | null) => void;
  readonly clear: () => void;
};

type SearchSplit = {
  readonly query: BrowserQuery;
  readonly rest: string;
};

type MatchContext = {
  readonly statuses: StatusMap;
  readonly users: ReadonlySet<string> | null;
};

type ItemCompare = (left: BrowserItem, right: BrowserItem) => number;

type FilterResult = {
  readonly matches: ReadonlySet<string>;
  readonly visible: ReadonlySet<string>;
};

type RowsInput = {
  readonly tree: ItemTree;
  readonly expanded: ReadonlySet<string>;
  readonly visible: ReadonlySet<string> | null;
};

type ListInput = {
  readonly tree: ItemTree;
  readonly matches: ReadonlySet<string> | null;
  readonly collapsed: ReadonlySet<string>;
  readonly view: Pick<ProjectViewSettings, 'group' | 'sort'>;
};

type ParentInput = {
  readonly targets: readonly BrowserItem[];
  readonly tree: ItemTree;
  readonly roleDir: string | undefined;
};

type CreateTarget = { readonly parentKey: string; readonly create: 'folder' | 'sprite' };

type EditTarget = { readonly kind: 'rename'; readonly key: string } | ({ readonly kind: 'create' } & CreateTarget);

type EditState = {
  readonly editing: EditTarget | null;
  readonly error: string | null;
  readonly setEditing: (target: EditTarget | null) => void;
  readonly setError: (message: string | null) => void;
};

type EditInput = {
  readonly state: EditState;
  readonly itemOf: (key: string) => BrowserItem | undefined;
  readonly selection: SelectionModel;
  readonly view: BrowserView;
  readonly refresh: () => void;
};

type BrowserEdit = {
  readonly editing: EditTarget | null;
  readonly error: string | null;
  readonly startRename: (key: string) => void;
  readonly startFolder: (parentKey: string) => void;
  readonly startSprite: (parentKey: string) => void;
  readonly stop: () => void;
  readonly commit: (typed: string) => Promise<void>;
};

type RowsHookInput = {
  readonly model: BrowserModel;
  readonly view: BrowserView;
  readonly query: BrowserQuery;
  readonly create: CreateTarget | null;
};

type BrowserRows = {
  readonly rows: readonly VisibleRow[];
  readonly mode: ViewMode;
  readonly filtered: boolean;
  readonly shown: number | null;
  readonly itemOf: (key: string) => BrowserItem | undefined;
};

type SelectionState = {
  readonly keys: ReadonlySet<string>;
  readonly anchor: string | null;
  readonly focus: string | null;
};

type RevealRequest = { readonly key: string; readonly serial: number; readonly focus: boolean };

type SelectionModel = SelectionState & {
  readonly targets: readonly BrowserItem[];
  readonly request: RevealRequest | null;
  readonly click: (key: string, shift: boolean, toggle: boolean) => void;
  readonly focusOn: (key: string, reveal?: boolean) => void;
  readonly reveal: (key: string) => void;
  readonly choose: (keys: readonly string[]) => void;
  readonly extend: (key: string) => void;
  readonly selectAll: () => void;
  readonly clear: () => void;
};

type ClickInput = {
  readonly selection: SelectionState;
  readonly rows: readonly VisibleRow[];
  readonly key: string;
  readonly shift: boolean;
  readonly toggle: boolean;
};

type FocusMove =
  | { readonly kind: 'focus'; readonly key: string }
  | { readonly kind: 'expand'; readonly key: string }
  | { readonly kind: 'collapse'; readonly key: string }
  | { readonly kind: 'none' };

type ListBucket = { readonly header: BrowserItem; readonly items: BrowserItem[] };

type ProjectViewSettings = {
  readonly mode: ViewMode;
  readonly density: ViewDensity;
  readonly tile: TileSize;
  readonly group: ListGroup;
  readonly sort: 'name' | 'kind' | 'modified' | 'created' | 'folder';
  readonly follow: boolean;
  readonly expanded: Readonly<Record<string, readonly string[]>>;
};

export type {
  BrowserEntry,
  BrowserEdit,
  BrowserItem,
  BrowserModel,
  BrowserQuery,
  BrowserQueryState,
  BrowserRoot,
  BrowserRows,
  BrowserSource,
  BrowserView,
  ClickInput,
  CreateTarget,
  EditInput,
  EditState,
  EditTarget,
  FocusMove,
  ItemKind,
  ItemRole,
  ItemState,
  ItemStatus,
  FilterCounts,
  FilterResult,
  ItemCompare,
  ItemTree,
  ListedEntries,
  ListBucket,
  ListGroup,
  ListInput,
  MatchContext,
  ParentInput,
  ProjectViewSettings,
  RevealRequest,
  RowsHookInput,
  RowsInput,
  SearchSplit,
  SelectionModel,
  SelectionState,
  StatusContext,
  StatusInput,
  StatusMap,
  TileSize,
  TreeInput,
  ViewDensity,
  ViewMode,
  VisibleRow,
};
