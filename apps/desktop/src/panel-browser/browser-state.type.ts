/* @layer renderer-app @kind types */
import type { Artwork, AssetKey } from '@bxel/document';
import type { AssetRow } from '../asset-list/asset-list.type';
import type { BrowserFacts, BrowserQuery as SharedQuery } from '../project-browser/project-browser.type';
import type { BrowserItem, ItemTree, ListGroup, SortChoice, StatusMap, TileSize, ViewDensity, ViewMode, VisibleRow } from './project-browser.type';

type SearchState = {
  readonly text: string;
  readonly missing: boolean;
  readonly query: SharedQuery;
};

type SearchModel = SearchState & {
  readonly tokens: string;
  readonly count: number;
  readonly active: boolean;
  readonly chips: readonly { readonly text: string; readonly label: string }[];
  readonly setText: (text: string) => void;
  readonly toggle: (token: string) => void;
  readonly remove: (token: string) => void;
  readonly clear: () => void;
};

type ListInput = {
  readonly tree: ItemTree;
  readonly matches: ReadonlySet<string> | null;
  readonly collapsed: ReadonlySet<string>;
  readonly view: Pick<ProjectViewSettings, 'group' | 'sort'>;
};

type ListBucket = { readonly header: BrowserItem; readonly items: BrowserItem[] };

type ProjectViewSettings = {
  readonly mode: ViewMode;
  readonly density: ViewDensity;
  readonly tile: TileSize;
  readonly group: ListGroup;
  readonly sort: SortChoice;
  readonly follow: boolean;
  readonly highlightOnly: boolean;
  readonly expanded: Readonly<Record<string, readonly string[]>>;
};

type BrowserModel = {
  readonly tree: ItemTree;
  readonly rows: readonly AssetRow[];
  readonly statuses: StatusMap;
  readonly referrers: ReadonlyMap<string, readonly string[]>;
  readonly activeKey: string | null;
  readonly artwork: Artwork | null;
  readonly ready: boolean;
  readonly truncated: boolean;
};

type BrowserView = ProjectViewSettings & {
  readonly fresh: boolean;
  readonly expandedSet: ReadonlySet<string>;
  readonly collapsedGroups: ReadonlySet<string>;
  readonly openOnClick: boolean;
  readonly set: (change: Partial<ProjectViewSettings>) => void;
  readonly setOpen: (keys: readonly string[], open: boolean) => void;
  readonly replaceOpen: (keys: readonly string[]) => void;
  readonly toggleGroup: (key: string) => void;
  readonly setCollapsed: (keys: readonly string[]) => void;
};

type ViewTree = {
  readonly top: readonly BrowserItem[];
  readonly childrenOf: (item: BrowserItem) => readonly BrowserItem[] | undefined;
};

type BrowserRows = {
  readonly rows: readonly VisibleRow[];
  readonly nested: ViewTree;
  readonly mode: ViewMode;
  readonly filtered: boolean;
  readonly shown: number | null;
  readonly visible: ReadonlySet<string> | null;
  readonly highlight: ReadonlySet<string> | null;
  readonly opened: ReadonlySet<string> | null;
  readonly itemOf: (key: string) => BrowserItem | undefined;
};

type RowsInput = {
  readonly model: BrowserModel;
  readonly view: BrowserView;
  readonly search: SearchState;
  readonly create: CreateTarget | null;
  readonly facts: ReadonlyMap<string, BrowserFacts>;
  readonly keys: ReadonlyMap<string, AssetKey>;
};

type CreateTarget = { readonly parentKey: string; readonly create: 'sprite' };

type EditTarget = { readonly kind: 'rename'; readonly key: string } | ({ readonly kind: 'create' } & CreateTarget);

type EditState = {
  readonly editing: EditTarget | null;
  readonly error: string | null;
  readonly setEditing: (target: EditTarget | null) => void;
  readonly setError: (message: string | null) => void;
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
  readonly focusOn: (key: string) => void;
  readonly reveal: (key: string, focus?: boolean) => void;
  readonly choose: (keys: readonly string[]) => void;
  readonly selectAll: () => void;
  readonly clear: () => void;
};

type EditInput = {
  readonly state: EditState;
  readonly itemOf: (key: string) => BrowserItem | undefined;
  readonly selection: SelectionModel;
  readonly view: BrowserView;
  readonly refresh: () => void;
};

type FolderStartInput = {
  readonly itemOf: (key: string) => BrowserItem | undefined;
  readonly view: BrowserView;
  readonly refresh: () => void;
  readonly begin: (target: EditTarget) => void;
  readonly selection: SelectionModel;
  readonly setError: (message: string | null) => void;
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

type ParentInput = {
  readonly targets: readonly BrowserItem[];
  readonly tree: ItemTree;
  readonly roleDir: string | undefined;
};

type ClickInput = {
  readonly selection: SelectionState;
  readonly rows: readonly VisibleRow[];
  readonly key: string;
  readonly shift: boolean;
  readonly toggle: boolean;
};

export type {
  BrowserEdit,
  BrowserModel,
  BrowserRows,
  BrowserView,
  ClickInput,
  CreateTarget,
  EditInput,
  EditState,
  EditTarget,
  FolderStartInput,
  ListBucket,
  ListInput,
  ParentInput,
  ProjectViewSettings,
  RevealRequest,
  RowsInput,
  SearchModel,
  SearchState,
  SelectionModel,
  SelectionState,
  ViewTree,
};
