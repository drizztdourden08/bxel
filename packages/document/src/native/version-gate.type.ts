/* @layer core @kind types */
import type { LoadIssue } from './load-report.type';

type VersionGate = {
  readonly issue: LoadIssue | null;
  readonly readOnly: boolean;
  readonly notice: string | null;
};

export type { VersionGate };
