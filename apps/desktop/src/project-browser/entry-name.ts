/* @layer renderer-app @kind logic */
import type { BrowserEntry } from './project-browser.type';

const entryName = (entry: BrowserEntry): string => (entry.kind === 'folder' ? entry.name : entry.row.name);

export { entryName };
