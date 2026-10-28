/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { BrowserEntry, BrowserQuery, Crumb, FileEntry, SourceRoot } from './project-browser.type';

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

export type { BrowserModel };
