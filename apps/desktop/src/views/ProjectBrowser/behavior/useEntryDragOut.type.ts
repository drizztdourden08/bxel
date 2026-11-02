/* @layer renderer-app @kind types */
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

interface EntryDragOut {
  readonly picked: readonly BrowserEntry[];
  readonly disabled: boolean;
}

export type { EntryDragOut };
