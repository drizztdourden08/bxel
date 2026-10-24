/* @layer core @kind types */
import type { EntryKind } from './entry-kind.type';

type RawEntry = {
  readonly name: string;
  readonly kind: 'file' | 'folder';
  readonly size: number;
  readonly modified: number;
};

type ListedFolder = {
  readonly name: string;
  readonly kind: 'folder';
};

type ListedFile = {
  readonly name: string;
  readonly kind: EntryKind;
  readonly bytes: number;
  readonly modified: number;
};

type ListedEntry = ListedFolder | ListedFile;

type ListOptions = {
  readonly kinds: readonly EntryKind[];
  readonly offset: number;
  readonly limit: number;
};

type Listing = {
  readonly entries: readonly ListedEntry[];
  readonly total: number;
  readonly skipped: number;
  readonly truncated: boolean;
};

export type { ListedEntry, ListedFile, ListedFolder, Listing, ListOptions, RawEntry };
