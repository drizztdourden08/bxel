/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { BrowserEntry, BrowserQuery, Crumb, FileEntry, FolderEntry, SourceRoot } from './project-browser.type';

type BrowserModel = {
  readonly editable: boolean;
  readonly projectName: string;
  readonly artwork: Artwork | null;
  readonly roots: readonly SourceRoot[];
  readonly folder: string | null;
  readonly crumbs: readonly Crumb[];
  readonly siblings: (path: string | null) => readonly FolderEntry[];
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
