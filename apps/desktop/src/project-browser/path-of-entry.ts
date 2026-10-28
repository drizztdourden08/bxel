/* @layer renderer-app @kind logic */
import type { BrowserEntry } from './project-browser.type';

const pathOfEntry = (entry: BrowserEntry): string => (entry.kind === 'folder' ? entry.path : entry.row.path);

export { pathOfEntry };
