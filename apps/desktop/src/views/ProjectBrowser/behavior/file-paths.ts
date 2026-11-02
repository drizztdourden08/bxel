/* @layer renderer-app @kind logic */
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

const filePaths = (entries: readonly BrowserEntry[]): readonly string[] =>
  entries.flatMap((entry) => (entry.kind === 'file' && entry.row.path !== '' ? [entry.row.path] : []));

export { filePaths };
