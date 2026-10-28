/* @layer renderer-app @kind types */
import type { Artwork, AssetKey } from '@bxel/document';
import type { AssetRow } from '../asset-list/asset-list.type';
import type { BrowserEntry, BrowserFacts, BrowserQuery, Crumb, FileEntry, SourceRoot } from './project-browser.type';

type BrowserModel = {
  readonly editable: boolean;
  readonly projectName: string;
  readonly artwork: Artwork | null;
  readonly roots: readonly SourceRoot[];
  readonly folder: string | null;
  readonly crumbs: readonly Crumb[];
  readonly entriesIn: (path: string | null) => readonly BrowserEntry[];
  readonly folderPaths: readonly string[];
  readonly entries: readonly BrowserEntry[];
  readonly files: readonly FileEntry[];
  readonly everyFile: readonly FileEntry[];
  readonly order: readonly string[];
  readonly selected: readonly BrowserEntry[];
  readonly query: BrowserQuery;
  readonly searching: boolean;
  readonly unsaved: number;
  readonly total: number;
  readonly parentFolder: string | null;
  readonly refresh: () => void;
};

type BrowserSource = {
  readonly live: boolean;
  readonly artwork: Artwork | null;
  readonly roots: readonly SourceRoot[];
  readonly rows: readonly AssetRow[];
  readonly facts: ReadonlyMap<string, BrowserFacts>;
  readonly keys: ReadonlyMap<string, AssetKey>;
  readonly folders: readonly string[];
  readonly refresh: () => void;
  readonly projectName: string;
};

export type { BrowserModel, BrowserSource };
