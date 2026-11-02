/* @layer renderer-app @kind types */
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

type ColumnsTree = {
  readonly items: readonly BrowserEntry[];
  readonly childrenOf: (entry: BrowserEntry) => readonly BrowserEntry[] | undefined;
  readonly path: readonly string[];
  readonly pick: (next: ReadonlySet<string>) => void;
  readonly walk: (next: readonly string[]) => void;
};

export type { ColumnsTree };
