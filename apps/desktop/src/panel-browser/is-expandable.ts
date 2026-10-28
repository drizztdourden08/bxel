/* @layer renderer-app @kind logic */
import type { BrowserItem } from './project-browser.type';

const isExpandable = (item: BrowserItem): boolean => item.role === 'folder' || item.role === 'linked' || item.role === 'group';

export { isExpandable };
