/* @layer renderer-app @kind types */
import type { AssetKey } from '@bxel/document';
import type { TreeNode } from '@drizztdourden08/tessera';
import type { AssetRow, ListedFile, RowKind } from '../asset-list/asset-list.type';

type BrowserView = 'grid' | 'list' | 'columns';

type SortKey = 'name' | 'kind' | 'modified' | 'folder' | 'size' | 'frames' | 'usedBy';

type BrowserSort = { readonly key: SortKey; readonly descending: boolean };

type BrowserFacts = {
  readonly width: number | null;
  readonly height: number | null;
  readonly frames: number | null;
  readonly palette: string | null;
  readonly colours: number | null;
  readonly uses: readonly string[];
  readonly usedBy: readonly string[];
  readonly open: boolean;
};

type FileEntry = {
  readonly kind: 'file';
  readonly id: string;
  readonly row: AssetRow;
  readonly facts: BrowserFacts;
  readonly pinned: boolean;
  readonly key: AssetKey | null;
};

type FolderEntry = {
  readonly kind: 'folder';
  readonly id: string;
  readonly path: string;
  readonly name: string;
  readonly count: number;
  readonly root: boolean;
  readonly linked: boolean;
};

type BrowserEntry = FileEntry | FolderEntry;

type Comparison = 'lt' | 'gt' | 'eq';

type NumberTest = { readonly op: Comparison; readonly value: number };

type BrowserQuery = {
  readonly words: readonly string[];
  readonly kinds: readonly RowKind[];
  readonly inFolder: string | null;
  readonly uses: readonly string[];
  readonly usedBy: readonly string[];
  readonly is: readonly QueryFlag[];
  readonly size: readonly NumberTest[];
  readonly colours: readonly NumberTest[];
  readonly chips: readonly QueryChip[];
};

type QueryFlag = 'unused' | 'unsaved' | 'open' | 'pinned';

type QueryChip = { readonly text: string; readonly label: string };

type SavedFilter = { readonly id: string; readonly name: string; readonly query: string };

type SavedBrowserView = {
  readonly view: BrowserView;
  readonly size: number;
  readonly sort: BrowserSort;
  readonly preview: boolean;
  readonly folder: string | null;
  readonly pinned: readonly string[];
  readonly smart: readonly SavedFilter[];
};

type ProjectTree = {
  readonly files: readonly ListedFile[];
  readonly folders: readonly string[];
};

type SourceRoot = {
  readonly path: string;
  readonly name: string;
  readonly linked: boolean;
};

type Crumb = { readonly label: string; readonly path: string | null };

type BrowserMode = 'open' | 'disk';

type RowCells = { readonly kind: string; readonly size: string; readonly frames: string; readonly palette: string; readonly folder: string; readonly modified: string; readonly users: string };

type Selection = { readonly ids: readonly string[]; readonly anchor: string | null };

type Modifiers = { readonly ctrl: boolean; readonly shift: boolean };

type Measure = Pick<BrowserFacts, 'width' | 'height' | 'frames' | 'palette' | 'colours'>;

type FolderNode = TreeNode<never>;

type BrowserViews = Readonly<Record<string, SavedBrowserView>>;

type EntryInput = {
  readonly rows: readonly AssetRow[];
  readonly facts: ReadonlyMap<string, BrowserFacts>;
  readonly keys: ReadonlyMap<string, AssetKey>;
  readonly roots: readonly SourceRoot[];
  readonly folders: readonly string[];
  readonly folder: string | null;
  readonly query: BrowserQuery;
  readonly pinned: ReadonlySet<string>;
  readonly sort: BrowserSort;
};

type Compare = (left: FileEntry, right: FileEntry) => number;

type FactsAndKeys = { readonly facts: ReadonlyMap<string, BrowserFacts>; readonly keys: ReadonlyMap<string, AssetKey> };

type Branch = { readonly path: string; readonly label: string; readonly linked: boolean };

type QueryChange = Partial<BrowserQuery> | null;

export type { Branch, BrowserEntry, BrowserFacts, BrowserMode, BrowserQuery, BrowserSort, BrowserView, BrowserViews, Comparison, Compare, Crumb, EntryInput, FactsAndKeys, FileEntry, FolderEntry, FolderNode, Measure, Modifiers, NumberTest, ProjectTree, QueryChange, QueryChip, QueryFlag, RowCells, SavedBrowserView, SavedFilter, Selection, SortKey, SourceRoot };
