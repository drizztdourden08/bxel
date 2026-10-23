/* @layer core @kind types */
import type { LoadIssue } from './load-report.type';

type ListedEntry = { readonly name: string; readonly size: number };

type ArchiveContents = {
  readonly files: ReadonlyMap<string, Uint8Array>;
  readonly unreadable: ReadonlySet<string>;
};

type ArchiveRead =
  | { readonly ok: true; readonly archive: ArchiveContents }
  | { readonly ok: false; readonly issue: LoadIssue };

export type { ArchiveContents, ArchiveRead, ListedEntry };
