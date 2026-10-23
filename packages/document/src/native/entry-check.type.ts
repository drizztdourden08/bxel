/* @layer core @kind types */
import type { LoadIssue } from './load-report.type';

type EntryCheck = {
  readonly good: ReadonlyMap<string, Uint8Array>;
  readonly problems: ReadonlyMap<string, LoadIssue>;
};

export type { EntryCheck };
