/* @layer core @kind types */
import type { LISTED_KINDS } from './listing.constants';

type ListedKind = (typeof LISTED_KINDS)[number];

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
  readonly kind: ListedKind;
  readonly bytes: number;
  readonly modified: number;
};

type ListedEntry = ListedFolder | ListedFile;

type ListOptions = {
  readonly kinds: readonly ListedKind[];
  readonly offset: number;
  readonly limit: number;
};

type Listing = {
  readonly entries: readonly ListedEntry[];
  readonly total: number;
  readonly skipped: number;
  readonly truncated: boolean;
};

export type { ListedEntry, ListedFile, ListedFolder, ListedKind, Listing, ListOptions, RawEntry };
