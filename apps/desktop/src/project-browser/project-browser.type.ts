/* @layer renderer-app @kind types */
import type { AssetKey } from '@bxel/document';
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

type SmartFilter = { readonly id: string; readonly name: string; readonly query: string };

type SavedBrowserView = {
  readonly view: BrowserView;
  readonly size: number;
  readonly sort: BrowserSort;
  readonly preview: boolean;
  readonly folder: string | null;
  readonly pinned: readonly string[];
  readonly smart: readonly SmartFilter[];
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

export type { BrowserEntry, BrowserFacts, BrowserMode, BrowserQuery, BrowserSort, BrowserView, Comparison, Crumb, FileEntry, FolderEntry, NumberTest, ProjectTree, QueryChip, QueryFlag, SavedBrowserView, SmartFilter, SortKey, SourceRoot };
