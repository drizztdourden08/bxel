/* @layer core @kind types */
import type { LoadIssue } from './load-report.type';

type Parsed<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly issues: readonly LoadIssue[] };

export type { Parsed };
